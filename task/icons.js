const svg2png = require('svg2png')
    ,utils = require('./utils')
    ,{read,save} = utils
    ,fs = require('fs')
    ,commander = require('commander')
        .usage('[options] <files ...>')
        .option('--source [source]', 'Source path')
        .option('--target [target]', 'Target path')
        .option('--sizes [sizes]', 'Sizes')
        .parse(process.argv)
    ,{source,target} = commander
    ,sizes = commander.sizes.split(/,/g).map(size=>size.split(/x/).map(parseFloat))

sizes.forEach((o,a)=>o.length===1&&o.push(o[0]))

read(source)
    .then(sourceBuffer=>
        Promise.all(sizes.map(([width,height])=>
          svg2png(sourceBuffer, {width,height})
            .then(buffer=>save(`${target}/icon-${width}x${height}.png`,buffer))
          )
        )
    )
    .catch(e => console.error(e))