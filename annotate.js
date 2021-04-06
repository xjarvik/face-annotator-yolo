const tf = require("@tensorflow/tfjs")
const fs = require("fs")
const readline = require("readline")
const blazeface = require("@tensorflow-models/blazeface")
const pixels = require("image-pixels")

const askQuestion = function(query){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    return new Promise(resolve => rl.question(query, ans => {
        rl.close()
        resolve(ans)
    }))
}

module.exports = async function(path, label){
    if(!path){
        console.log("Error: You must specify a folder.")
        process.exit(0)
    }
    else if(!label){
        console.log("Error: You must specify a label.")
        process.exit(0)
    }
    else if(path.charAt(path.length - 1) != "/"){
        path = path.concat("/")
    }
    
    const dir = await fs.promises.opendir(path)
    var annotatedImages = 0

    console.log("Loading BlazeFace...\n")
    const model = await blazeface.load()

    for await(const dirent of dir){
        const fileName = dirent.name
        if(fileName.endsWith(".jpg") || fileName.endsWith(".png")){
            var obj = {
                image: fileName,
                annotations: []
            }
            const img = await pixels(fs.readFileSync(path + fileName))
            const predictions = await model.estimateFaces(img, false)
            if(predictions.length > 0){
                annotatedImages++
                process.stdout.write("\rAnnotated " + annotatedImages + " images...")
            }
            for(let i = 0; i < predictions.length; i++){
                const start = predictions[i].topLeft
                const end = predictions[i].bottomRight
                const size = [end[0] - start[0], end[1] - start[1]]
                obj.annotations.push({
                    label: label,
                    coordinates: {
                        x: (start[0] + (size[0] / 2)) / img.width,
                        y: (start[1] + (size[1] / 2)) / img.height,
                        width: size[0] / img.width,
                        height: size[1] / img.height
                    }
                })
            }

            if(obj.annotations.length > 0){
                if(fs.existsSync(path + fileName.slice(0, -4) + ".txt")){
                    fs.writeFileSync(path + fileName.slice(0, -4) + ".txt", "")
                }
                var logger = fs.createWriteStream(path + fileName.slice(0, -4) + ".txt", { flags: "a" })
                var count = 0
                obj.annotations.forEach(function(ann){
                    count++
                    logger.write(
                        ann.label
                        + " " +
                        ann.coordinates.x
                        + " " +
                        ann.coordinates.y
                        + " " +
                        ann.coordinates.width
                        + " " +
                        ann.coordinates.height
                    )
                    if(count != obj.annotations.length){
                        logger.write("\n")
                    }
                })
                logger.end()
            }
        }
    }

    console.log("\nDone.")
}