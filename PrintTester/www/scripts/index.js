// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    
    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var element = document.getElementById("deviceready");
        element.innerHTML = 'Device Ready';
        element.className += ' ready';

        $("#find").click(function() {
            alert("Finding...");
            window.cordova.plugins.zbtprinter.find(
                function(mac) {
                    alert(mac);
                },
                function(fail) {
                    alert(fail);
                }
            );
        });

        $("#bluetooth").click(function() {
            alert("Checking Bluetooth...");

            window.bluetoothSerial.isEnabled(
                function() {
                    alert("bluetooth enabled");

                    window.bluetoothSerial.isConnected(
                        function() {
                            console.log("Bluetooth is connected");
                        },
                        function() {
                            console.log("Bluetooth is *not* connected");
                        }
                    );


                }, function() {
                    alert("bluetooth *not* enabled");
                });

        });


        $("#print").click(function() {

            alert("Printing...");

            window.cordova.plugins.zbtprinter.find(
                function (mac) {

                    window.cordova.plugins.zbtprinter.print(mac, "^XA^FO10,10^AFN,26,13^FDHello, World!^FS^XZ",
                        function(success) {
                            alert("Print ok");
                        }, function(fail) {
                            alert(fail);
                        }
                    );

                },
                function (fail) {
                    alert(fail);
                }
            );

           

        });

    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();