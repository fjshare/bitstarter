#!/usr/bin/env node

/*
Automatically grade file for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio.  Teaches command line application development
and basic DOM parsing.


References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require ('fs');
var sys = require('util');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "./index.html";
var CHECKSFILE_DEFAULT = "checks.json";



var assertFileExits = function(infile) {
    
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist.  Exiting.", instr);
	process.exit(1); 

    }
	
    return instr; 

};


var checkHtml = function (Err, html, checks){
    if(Err){
	console.log("Error:" + Err);
	process.exit(1);
    } 

    var checkJson = checkHtmlFile(html, checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
};


var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));

};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));

};

var checkHtmlFile = function(htmlfile, checksfile) {

    if(program.url){

     $ = cheerio.load(htmlfile);   
    }else {
    	$ = cheerioHtmlFile(htmlfile);

    }	
    var checks = loadChecks(checksfile).sort();
    var out = {};
    
    for( var ii in checks) {

	var present = $(checks[ii]).length > 0
	out[checks[ii]] = present;

    }	
    return out;

};

var clone = function(fn) {

    //Workaround for commander.js issue.
    return fn.bind({});
};

if(require.main == module) {

     program 
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExits), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExits), HTMLFILE_DEFAULT)
        .option('-u , --url <html_file>', 'Path to url' )
	.parse(process.argv);
    
    if(program.url){

	rest.get(program.url).on('complete', function(result){
	checkHtml((result instanceof Error), result, program.checks); 
	    //var checkJson = checksHtmlFile(program.url, program.checks);
    });	
    }else 

	var checkJson = checkHtmlFile(program.file, program.checks);
        var outJson = JSON.stringify(checkJson, null, 4);
        console.log(outJson);

}
else{

    exports.checkHtmlFile = checkHtmlFile;
    
}
