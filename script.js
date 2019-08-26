var map, directionsManager;
    function GetMap()
    {
        map = new Microsoft.Maps.Map('#myMap', {});
        //Load the directions module.
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
            
            directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
            
            directionsManager.setRenderOptions({ 
                itineraryContainer: '#directionsItinerary',
                routeMode: Microsoft.Maps.Directions.RouteMode.driving
                 });
            
            directionsManager.showInputPanel('directionsPanel');

            Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', directionsError);
            Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', directionsUpdated);

        });
    }
     
    function GetDirections() {
        
        directionsManager.clearAll();
        directionsManager.clearDisplay();
        
        var start = new Microsoft.Maps.Directions.Waypoint({ address: document.getElementById('fromTbx').value });
        directionsManager.addWaypoint(start);
        var end = new Microsoft.Maps.Directions.Waypoint({ address: document.getElementById('searchBox').value });
        directionsManager.addWaypoint(end);
        
        directionsManager.calculateDirections();
    }
    function directionsUpdated(e) {
            //Get the current route index.
            var routeIdx = directionsManager.getRequestOptions().routeIndex;
            //Get the distance of the route, rounded to 2 decimal places.
            var distance = Math.round(e.routeSummary[routeIdx].distance * 100)/100;
            //Get the distance units used to calculate the route.
            var units = directionsManager.getRequestOptions().distanceUnit;
            var distanceUnits = '';
            if (units == Microsoft.Maps.Directions.DistanceUnit.km) {
                distanceUnits = 'km'
            } else {
                //Must be in miles
                distanceUnits = 'miles'
            }
            //Time is in seconds, convert to minutes and round off.
            var time = Math.round(e.routeSummary[routeIdx].timeWithTraffic / 60);
            var Hours = Math.round(time/60);
            document.getElementById('routeInfoPanel').innerHTML = 'Distance: ' + distance + ' ' + distanceUnits + '<br/>Time with Traffic: ' + Hours + ' Hours';
        }
        function directionsError(e) {
            alert('Error: ' + e.message + '\r\nResponse Code: ' + e.responseCode)
        }


// jQuery function for Autocomplet 
        
        $(document).ready(function () {
            $("#searchBox").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: "http://dev.virtualearth.net/REST/v1/Locations",
                        dataType: "jsonp",
                        data: {
                            key: "Yout Api",
                            q: request.term
                        },
                        jsonp: "jsonp",
                        success: function (data) {
                            var result = data.resourceSets[0];
                            if (result) {
                                if (result.estimatedTotal > 0) {
                                    response($.map(result.resources, function (item) {
                                        return {
                                            data: item,
                                            label: item.name + ' (' + item.address.countryRegion + ')',
                                            value: item.name
                                        }
                                    }));
                                }
                            }
                        }
                    });
                },
                minLength: 1,
                change: function (event, ui) {
                    if (!ui.item)
                        $("#searchBox").val('');
                },
                select: function (event, ui) {
                    displaySelectedItem(ui.item.data);
                }
            });
        });

        function displaySelectedItem(item) {
            $("#searchResult").empty().append('Result: ' + item.name).append(' (Latitude: ' + item.point.coordinates[0] + ' Longitude: ' + item.point.coordinates[1] + ')');
        }

         $(document).ready(function () {
            $("#fromTbx").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: "http://dev.virtualearth.net/REST/v1/Locations",
                        dataType: "jsonp",
                        data: {
                            key: "Yout Api",
                            q: request.term
                        },
                        jsonp: "jsonp",
                        success: function (data) {
                            var result = data.resourceSets[0];
                            if (result) {
                                if (result.estimatedTotal > 0) {
                                    response($.map(result.resources, function (item) {
                                        return {
                                            data: item,
                                            label: item.name + ' (' + item.address.countryRegion + ')',
                                            value: item.name
                                        }
                                    }));
                                }
                            }
                        }
                    });
                },
                minLength: 1,
                change: function (event, ui) {
                    if (!ui.item)
                        $("#fromTbx").val('');
                },
                select: function (event, ui) {
                    displaySelectedItem(ui.item.data);
                }
            });
        });

        function displaySelectedItem(item) {
            $("#searchResult").empty().append('Result: ' + item.name).append(' (Latitude: ' + item.point.coordinates[0] + ' Longitude: ' + item.point.coordinates[1] + ')');
        }


        $("#searchBox").focusout(GetDirections());