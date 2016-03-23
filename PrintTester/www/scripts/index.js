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

        var associatedPrinterMac = null;

        // Hook up TC55 linear barcode scanner
        if (window.datawedge) {
            window.datawedge.start("com.spartansolutions.datawedge.ACTION");
            window.datawedge.registerForBarcode(function(data) {
                // convert to mac address syntax
                var mac = data.barcode.replace(/(.{2})/g, "$1:").slice(0, -1);
                associatedPrinterMac = mac;
                $("#printer").text(associatedPrinterMac);
            });
        }

        // Handle Print Button
        $("#print").click(function() {

            if (associatedPrinterMac) {

                $.Deferred().resolve()
                    .then(function() {
                        // Check that bluetooth is enabled and if not, try to enable it
                        var p = $.Deferred();

                        window.bluetoothSerial.isEnabled(
                            p.resolve,
                            function() {
                                window.bluetoothSerial.enable(p.resolve, p.reject);
                            });

                        return p;
                    })
                    .fail(function() {
                        // Enable it if it is not
                        alert("Unable to start bluetooth.");
                    })
                    .then(function() {
                        var p = $.Deferred();
                        window.cordova.plugins.zbtprinter.print(associatedPrinterMac, "^XA^FO10,10^AFN,26,13^FDHello, World!^FS^XZ", p.resolve, p.reject);
                        return p;
                    })
                    .fail(function(err) {
                        alert("Unable to print: " + err);
                    });

            } else {
                alert("A printer has not been associated with the device.");
            }
        });
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();