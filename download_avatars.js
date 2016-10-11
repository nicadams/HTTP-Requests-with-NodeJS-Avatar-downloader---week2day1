const request = require("request");
const fs = require("fs");
const dotenv = require('dotenv').config();
gitAuthToken = process.env['gitHubAPItoken']

var repoOwner = process.argv[2];
var repoName = process.argv[3];

//handles errors
function printError (err) {
  if (err) {
    console.log("Errors:", err);
  }
}
//gets url with command line input// associates avatar urls to filepath
var getRepoContributors = ("repoOwner", "repoName", (err, result) => {
  printError();

  let endPoint  = 'https://api.github.com';
  let options = {
                url:        endPoint + '/repos/' + repoOwner + '/' + repoName + '/contributors',
                json: true,
                headers: {
                  'User-Agent': 'request',
                  'Authorization': 'token ' + gitAuthToken,
                }
  };

  request.get(options, function (err, response, body) {
    printError();

    body.forEach (function (user) {
      let url = user.avatar_url;
      let filePath = './avatars/' + user.login;
      downloadImageByURL(url, filePath);
    })
  });
// downloads images with specific file extension
  function downloadImageByURL(url, filePath) {

    request.get(url, function(err, response, body) {
      printError();
      console.log("Success: ", filePath);

      let fileType = response.headers['content-type'].split('/')[1];
      request(url).pipe(fs.createWriteStream(filePath + '.' + fileType));
    });
  }
});

getRepoContributors();



