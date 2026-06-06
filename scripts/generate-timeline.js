import fs from 'fs'
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
            if (file.endsWith('.md')) {
                  console.log(file);
            } else if (file.endsWith('.json')) {
                  console.log(file);
            } else if(!file.includes('.')){
                  generateTimeline(...await getChildren(dir + file + '/'));
            }
      });
}
generateTimeline(...await getChildren('./src/content/'))