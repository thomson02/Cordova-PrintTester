// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    
    // First, checks if it isn't implemented yet.
    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                  ? args[number]
                  : match
                ;
            });
        };
    }

    function constructPrintString(printItems) {

        var zebraCpclCommandPrefix = '! 0 200 200 550 1'; 
        var cursorYPosition = 15;

        var config = {
            textLineHeight: 40,
            barcodeHeight: 40,
            barcodeEncoding: "128",
            font: 0,
            fontSize: 3,
            maxCharsPerLine: 36,
            maxCharsPerLabel: 9
        };

        var dataString = [];
        dataString.push(zebraCpclCommandPrefix);

        for (var i = 0; i < printItems.length; i++) {
            if (printItems[i].text) {
                // TEXT {font} {size} {x} {y} {data}
                dataString.push('T {0} {1} {2} {3} {4}'.format(
                        config.font,
                        config.fontSize,
                        0,
                        cursorYPosition,
                        printItems[i].text.substring(0, config.maxCharsPerLine)));

                cursorYPosition += config.textLineHeight;
            }
            else if (printItems[i].barcode) {

                if (printItems[i].showText) {
                    // BARCODE-TEXT {font} {size} {offset}
                    dataString.push("BT {0} {1} {2}".format(
                        config.font,
                        config.fontSize,
                        5));
                }

                // BARCODE {code} {width} {ratio} {height} {x} {y} {data}
                dataString.push("B {0} {1} {2} {3} {4} {5} {6}".format(
                        config.barcodeEncoding,
                        1,
                        1,
                        config.barcodeHeight,
                        0,
                        cursorYPosition,
                        printItems[i].barcode
                    ));

                cursorYPosition += config.barcodeHeight + 10 + (printItems[i].showText ? config.textLineHeight : 0);

                if (printItems[i].showText) {
                    dataString.push("BT OFF");
                }
            }
            else if (printItems[i].line) {

                // TEXT {font} {size} {x} {y} {data}
                dataString.push("T {0} {1} {2} {3} {4}".format(
                        config.font,
                        config.fontSize,
                        0,
                        cursorYPosition,
                        Array(config.maxCharsPerLine).join('-')
                    ));

                cursorYPosition += config.textLineHeight;
            }
        }

        dataString.push("FORM");    // form feed after printing
        dataString.push("PRINT");   // terminate and print the file

        return dataString.join('\r\n') + '\r\n';
    };

    function fakeLabel() {
        var printItems = [
            { text: "Supplier:" },
            { text: "[COMPANY NAME]" },
            { text: "Received: 23 Mar 2016" },
            { text: "Inspection(s): None" },
            { text: "GRN#:" },
            { barcode: "5555555555", showText: true },
            { line: true },
            { text: "Parts:" },
            { text: "1. Qty: 1" },
            { text: "Store: [NAME OF STORE]" },
            { barcode: "5555" }
        ];

        return constructPrintString(printItems);
    };

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var element = document.getElementById("deviceready");
        element.innerHTML = 'Device Ready';
        element.className += ' ready';

        var associatedPrinterMac = "AC:3F:A4:0D:F2:1B"; //null;

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
                        window.cordova.plugins.zbtprinter.print(associatedPrinterMac, fakeLabel(), p.resolve, p.reject);
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