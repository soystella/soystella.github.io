//Configuration
let genTimelineConfig = {
      mainDir: "./src/content/",
      mode: "include", //include or exclude
      only: ['projects', 'posts'],
      deleteOldTimeline: true
}

//Project dependencies and basic functions
import fs from 'fs'
import yaml from 'js-yaml'
let list = []
function getConfigFromMd(rawMD) {
      let config = rawMD.split('---')[1]
      return yaml.load(config)
}
async function getChildren(dir) {
      return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, files) => {if (err) {console.error("Error reading timeline directory:", err);reject(err);return;}
            resolve([files, dir]);
            });
      });
}
async function generateTimeline(files, dir) {
      files.forEach(async (file) => {
            if (file.endsWith('.md')) {
                  const config = getConfigFromMd(await fs.promises.readFile(dir + file, 'utf8'));
                  if (!!!config) return;
                  list.push({"title": config.title,"description": config.description,"type": "project","startDate": config.startDate,"endDate": "","skills": config.techStack,"achievements": ["Task completed"],"links": [{"url": config.liveDemo,"name": "Live Demo","type": "project"}],"icon": "material-symbols:code","featured": config.featured,"color": "#7C3AED",});
                  console.log(file, ' ', config);
            } else if (file.endsWith('.json')) {
                  const config = JSON.parse(await fs.promises.readFile(dir + file, 'utf8'));
                  if (!!!config) return;
                  list.push({title: config.title, description: config.description,"type": "project","startDate": config.published, "endDate": "","skills": config.tags, "achievements": ["Task completed"],"links": [{"url": dir.split('content/')[1],"name": "Post","type": "post"}],"icon": "material-symbols:code","color": "#ed903a","featured": config.featured});
            } else if (!file.includes('.')) {
                  generateTimeline(...await getChildren(dir + file + '/'));
            }
      })
}

//Start of Script

//Delete old timeline
genTimelineConfig.deleteOldTimeline && fs.readdir('./src/content/timeline', (err, files) => {
      if (err) {
            console.error("Error reading timeline directory:", err);
            return;
      }
      // Process the files...
      files.forEach(file => {
            if (file == "first-template-project.json") return;
            fs.rm('./src/content/timeline/' + file, { recursive: true }, (err) => {
                  if (err) {
                        console.error(`Error deleting ${file}:`, err);
                  } else {
                        console.log(`${file} deleted successfully.`);
                  }
            });
      })
});
//define mode of timeline generation
if(genTimelineConfig.mode == "exclude") {
      getChildren('./src/content/').then(([files, dir]) => {
            let newFiles = files.filter(file => !genTimelineConfig.only.includes(file));
            generateTimeline(newFiles, dir);
      });
} else if(genTimelineConfig.mode == "include") {
      getChildren('./src/content/').then(([files, dir]) => {
            let newFiles = files.filter(file => genTimelineConfig.only.includes(file));
            generateTimeline(newFiles, dir);
      });
} else {
      console.error("Invalid mode in genTimelineConfig. Please use 'include' or 'exclude'.");
}
setTimeout(() => {
      setTimeout(() => {
            list.map((item, index) => {
                  if (!!!item.title) return;
                  fs.writeFile('./src/content/timeline/' + item.title + '.json', JSON.stringify(item, null, 2), (err) => {
                        if (err) {
                              console.error(`Error writing ${item.title}.json:`, err);
                        }
                  });
            })
      }, 50 * list.length);
}, 500);