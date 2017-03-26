const Promise = require('bluebird');
const fsExtra = require('fs-extra');
const fs = Promise.promisifyAll(fsExtra);
const logger = require('winston');

const total = randomIntFromInterval(20, 60);
const outputPath = 'output/';
const args = process.argv.slice(2);
console.log('args', args);
let random = randomIntFromInterval(1, 100);
if (args.find(x => x === '--warning')) random = 20;
if (args.find(x => x === '--error')) random = 5;
if (args.find(x => x === '--success')) random = 70;
logger.info('random', random);


Promise.resolve(Array.from(Array(total)))
    .each((item, index) => {
        if (index === Math.round(total / 2)) {
            if (random <= 10) {
                throw new Error(`File ${index}.txt not created due to errors`);
            }
            if (random <= 25) {
                logger.warn(`File ${index}.txt created with warnings`);
                // console.trace();
            }
        }
        return delay(1000).then(() => {
            logger.info(`File ${index}.txt created successfully`);
            return fs.outputFileAsync(outputPath + index + '.txt', `Some dummy text ${index}`);
        });
    })
    .then(() => {
        logger.info(`All files created successfully`);
    })
    .catch(err => logger.error(err));

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function delay(t) {
    return new Promise(resolve => {
        setTimeout(resolve, t)
    });
}