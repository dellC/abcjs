var Raphael = require('raphael');

var EngraverController = require('../../../src/write/engraver_controller');
var Parse = require('../../../src/parse/parse');


function svgToPng(svg) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('CANVAS');
      canvas.width = 800;
      canvas.height = 400;

      var context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/png'));
    }
    img.onerror = function(err) {
      reject(err);
    };
    img.src = 'data:image/svg+xml;utf8,' + svg;
  });
};

function compare(abcFile, svgFile) {
  var div = document.createElement('DIV');
  var paper = Raphael(div, 800, 400);
  var engraver = new EngraverController(paper);

  var parser = new Parse();

  return Promise.all([
    fetch(__dirname + abcFile),
    fetch(__dirname + svgFile)
  ]).then(rr => Promise.all([
    rr[0].text(),
    rr[1].text()
  ])).then(function (tt) {
    var abc = tt[0];
    var svg = tt[1];
    parser.parse(abc);
    var tune = parser.getTune();

    engraver.engraveABC(tune);

    return Promise.all([
      svgToPng(div.innerHTML),
      svgToPng(svg)
    ]);
  }).then(function (ii) {
    var renderedABC = ii[0];
    var renderedSVG = ii[1];

    // Should compare these two images. Some libraries to explore :
    //  - resemblejs 
    //  - pixelmatch
    //  - image-comparer
    //  - image-diff
    //  - image-compare
  });

};

module.exports = compare;
