import fs from 'fs'
import yaml from 'js-yaml'

let list = []

fs.readdir('./src/content/timeline', (err, files) => {
      if (err) {
            console.error("Error reading timeline directory:", err);
            return;
      }
      // Process the files...
      files.forEach(file => {
            if(file == "template.json") return;
            fs.rm('./src/content/timeline/' + file, { recursive: true }, (err) => {
                  if (err) {
                        console.error(`Error deleting ${file}:`, err);
                  } else {
                        console.log(`${file} deleted successfully.`);
                  }
            });
      })
});

function getConfigFromMd(rawMD) {
      let config = rawMD.split('---')[1]
      return yaml.load(config)
}
async function getChildren(dir) {
      return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, files) => {
                  if (err) {
                        console.error("Error reading timeline directory:", err);
                        reject(err);
                        return;
                  }
                  // Process the files...
                  resolve([files, dir]);
            });
      });
}
async function generateTimeline(files, dir) {
      files.forEach(async (file) => {
//______________________________________________________________________________________________________
            if (file.endsWith('.md')) {
                  const rawMD = await fs.promises.readFile(dir + file, 'utf8');
                  const config = getConfigFromMd(rawMD);
                  if(!!!config) return;
                  console.log(file, ' ', dir);
                  const newConfig = {
                        "title": config.title,
                        "description": config.description,
                        "type": "project",
                        "startDate": config.startDate,
                        "endDate": "",
                        "skills": config.techStack,
                        "achievements": ["Task completed"],
                        "links": [
                              {
                                    "name": "Live Demo",
                                    "url": config.liveDemo,
                                    "type": "project"
                              }
                        ],
                        "icon": "material-symbols:code",
                        "color": "#7C3AED",
                        "featured": config.featured
                  }
                  list.push(newConfig);
                  console.log(file, ' ', config);
            } else if (file.endsWith('.json')) {
//______________________________________________________________________________________________________
                  const rawJSON = await fs.promises.readFile(dir + file, 'utf8');
                  const config = JSON.parse(rawJSON);
                  const newConfig = {
                        "title": config.title,
                        "description": config.description,
                        "type": "project",
                        "startDate": config.published,
                        "endDate": "",
                        "skills": config.tags,
                        "achievements": ["Task completed"],
                        "links": [
                              {
                                    "name": "Post",
                                    "url": dir.split('content/')[1],
                                    "type": "post"
                              }
                        ],
                        "icon": "material-symbols:code",
                        "color": "#ed903a",
                        "featured": config.featured
                  }
                  list.push(newConfig);
            } else if (!file.includes('.')) {
//______________________________________________________________________________________________________
                  generateTimeline(...await getChildren(dir + file + '/'));
            }
      });
}
getChildren('./src/content/').then(([files, dir]) => {
      generateTimeline(files, dir);
});
setTimeout(() => {
      list.map((item, index) => {
            if(!!!item.title) return;
            fs.writeFile('./src/content/timeline/' + item.title + '.json', JSON.stringify(item, null, 2), (err) => {
                  if (err) {
                        console.error(`Error writing ${item.title}.json:`, err);
                  }
            });
      })
}, 3000);