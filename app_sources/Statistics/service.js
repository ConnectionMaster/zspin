'use strict';

app.factory('statistics', [ 'settings',
  function (settings) {
    console.log('statistics - init');
    var service = {};

    const $fs = require('fs');
    const $path = require('path');

    // Path for the app datas
    var dataPath = settings.dataPath();
    var statisticsPath = $path.join(dataPath, 'Statistics.json');

    //Stats to be stored
    service.$obj = {
      games:{}
    };

    // Blocking settings "write"
    service.write = function() {

      var data = JSON.stringify(service.$obj, null, 2);
      return $fs.writeFileSync(statisticsPath, data, 'utf8');
    };

    // Blocking settings "load"
    service.load = function() {
      var data = $fs.readFileSync(statisticsPath, 'utf8');
      try {
        var obj = JSON.parse(data);
        angular.extend(service.$obj, obj);
      } catch (e) {
        console.log('Statistics Error:', e);
      }
    };

    // deletes the Settings.json file
    service.deleteStatisticsFile = function() {
      $fs.unlinkSync(statisticsPath);
    };

    // Update the stats object and save
    service.incrementRuns = function(elem,elemPath) {
      if(elem in service.$obj.games) {
        service.$obj.games[elem].runCount++;
      }else{
        service.$obj.games[elem] = {runCount : 1, path : elemPath};
      }

      //Save file
      service.write();
    };




    // Write defaults settings if there is no Settings.json to load
    try {
      $fs.accessSync(statisticsPath, $fs.F_OK);
    } catch (e) {
      console.log('No statistics file ! Creating ' + statisticsPath);
      service.write();
    }

    // Load current values
    service.load();

    console.log('statistics - ready');
    return service;
  }
]);