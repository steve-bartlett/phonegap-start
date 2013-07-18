$(window.document).bind('mobileinit', function () {
    $.support.cors = true;
    $.mobile.pageLoadErrorMessageTheme = "c";
    $.mobile.allowCrossDomainPages = true;
    alert('called mobileinit');
});


$(document).on('pageshow', function (event, ui) {
    $(function () {
        $('a').not('[href^="http"],[href^="https"],[href^="mailto:"],[href^="#"]').each(function () {
            $(this).attr('href', function (index, value) {
                if (value.substr(0, 1) !== "/") {
                    value = window.location.pathname + value;
                }
               // return "https://ola.avon.com.au" + value;
                return "http://bkvmsmisdev02/" + value;
            });
        });
    });
});


function myParseDate(input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
}

$(document).on('pageinit', '#brochdet', function () {

    DisplayCreditUpline();

    $('#brochdet #CreditUplineType').change(function () {
        DisplayCreditUpline();
    });
});

$(document).on('pageinit', '#appdet', function () {

    if ($('#appdet #AreaNumber').val() == "0") {
        $('#appdet #AreaNumber').val('Looking for District ....');
        $.getJSON(AppUrlSettings.districtURl, function (data) {
            if (data.District > 0) {
                $('#appdet #AreaNumber').val(data.District);
            } else {
                $('#appdet #AreaNumber').val('');
            }
        }).error(function () { $('#appdet #AreaNumber').val(''); });
    }

});

$(document).on('pageinit', '#confdet', function () {
    DisplayAppointedBySL();

    $('#confdet #AppointedByType').change(function () {
        DisplayAppointedBySL();
    });

});

$(document).on('pageinit', '#contact', function () {
});

$(document).on('pageinit', '#addHome', function () {
    AutoCompleteSuburb('#addHome');
});

$(document).on('pageinit', '#addDelivery', function () {
    AutoCompleteSuburb('#addDelivery');
    DeliveryAddressVisibility('#addDelivery');

    $('#addDelivery #UseSameDelivery').bind("change", function (event, ui) {
        DeliveryAddressVisibility('#addDelivery');
    });
});

$(document).on('pageinit', '#addrel', function () {
    AutoCompleteSuburb('#addrel');
});


$(document).on('pageinit', '#QASHome', function () {
    qasAddress('#QASHome');
});

$(document).on('pageinit', '#QASRel', function () {
    qasAddress('#QASRel');
});

$(document).on('pageinit', '#QASDelivery', function () {
    DeliveryAddressVisibility('#QASDelivery');
    qasAddress('#QASDelivery');

    $('#QASDelivery #UseSameDelivery').bind("change", function (event, ui) {
        DeliveryAddressVisibility('#QASDelivery');
    });
});

function qasAddress(pagename) {
    $(pagename + ' #selectorlbl').hide();

    $(pagename + ' #addrfind').on("click", function () {

        $.mobile.loading('show');

        var term = $(pagename + ' #addressTerm').val();
        $(pagename + ' #selectorlbl').hide();
        $(pagename + ' #addrlst').empty();

        $.getJSON(AppUrlSettings.qasURL + "?term=" + term, function (data) {
            if (data.length > 0) {
                $(pagename + ' #selectorlbl').show();
                for (var i = 0; i < data.length; i++) {
                    var li = "<li id='" + i + "' key='" + data[i].ID + "' ><a onclick=\"useAddress('" + pagename + "','" + i + "')\" href='javascript:void(0)'>" + data[i].Address + "</a></li>";
                    $(pagename + ' #addrlst').append(li);
                }
            }
            $(pagename + ' #addrlst').listview("refresh");

        }).fail(function () { $.mobile.hidePageLoadingMsg(); alert("Error retrieving Address"); });

        $.mobile.loading('hide');
    });
}

function useAddress(pageName, index) {

    var id = $('#' + index).attr('key');

    if (id == "0")
        return;

    $.getJSON(AppUrlSettings.qasFinalURL + "?id=" + id, function (data) {

        if (data != null) {

            $(pageName + " #addressTerm").val("");
            $(pageName + " #divFormatAddress").html("");

            $(pageName + " #FormatPoBox").val(data.FormatPoBox);
            $(pageName + " #divFormatAddress").append(data.FormatPoBox + ' ');

            $(pageName + " #FormatUnit").val(data.FormatUnit);
            $(pageName + " #divFormatAddress").append(data.FormatUnit + ' ');

            $(pageName + " #FormatStreetNumber").val(data.FormatStreetNumber);
            $(pageName + " #divFormatAddress").append(data.FormatStreetNumber + ' ');

            $(pageName + " #FormatStreetName").val(data.FormatStreetName);
            $(pageName + " #divFormatAddress").append(data.FormatStreetName + ' ');

            $(pageName + " #FormatCity").val(data.FormatCity);
            $(pageName + " #divFormatCity").html(data.FormatCity);

            $(pageName + " #FormatPostcode").val(data.FormatPostcode);
            $(pageName + " #divFormatPostcode").html(data.FormatPostcode);

            $(pageName + " #FormatBarcode").val(data.Barcode);

            $(pageName + " #FormatState").val(data.FormatState);
            $(pageName + " #divFormatState").html(data.FormatState);

            $(pageName + " #IsFormatted").val("true");
        }
        $(pageName + ' #selectorlbl').hide();
        $(pageName + ' #addrlst').empty();
        $(pageName + " #addrlst").listview("refresh");

    }).error(function () {
        alert('Error looking up address ');
    });

}

function DeliveryAddressVisibility(pagename) {
    //   AddressLine1 State Postcode
    if ($(pagename + ' #UseSameDelivery').is(':checked') ) {
        $(pagename + ' #DeliveryDetails').hide();
    } else {
        $(pagename + ' #DeliveryDetails').show();
    }
}

function DisplayCreditUpline() {
    if ($('#brochdet #CreditUplineType').val() == "S") {
        $('#brochdet #DivUplineAccountNumber').show();
    }
    else {
        $('#brochdet #DivUplineAccountNumber').hide();
    }
}

function DisplayAppointedBySL() {
    if ($('#confdet #AppointedByType').val() == "S") {
        $('#confdet #DivAppointedBySLAccNumber').show();
    }
    else {
        $('#confdet #DivAppointedBySLAccNumber').hide();
    }
}

function AutoCompleteSuburb(pageName) {
    $(pageName + " #City").autocomplete({
        source: AppUrlSettings.serviceURl,
        minLength: 3,
        select: function (event, ui) {
            var value = ui.item.value;
            var array = value.split(',');
            if (array.length == 2) {
                $(pageName + " input#Postcode").val(jQuery.trim(array[1]));
                if (AppUrlSettings.country == 'AUS') {
                    SetStateAU(pageName);
                }
            }
        },
        close: function (event, ui) {
            var value = $(pageName + " input#City").val();
            var array = value.split(',');
            if (array.length == 2) {
                $(pageName + " input#City").val(jQuery.trim(array[0]));
            }
        }
    });
}

function SetStateAU(pageName) {
    /*
http://www.postcodes-australia.com/
    (ACT)	2600 to 2618 and 29##
    (NSW)	2###
    (NT)	08## and 09##
    (QLD)	4###
    (SA)	5###
    (TAS)	7###
    (VIC)	3###
    (WA)	6###
    */
    if ($(pageName + " input#Postcode").val() != null) {
        var state = "";
        var pc = $(pageName + " input#Postcode").val();
        if (pc.charAt(0) == "2") {
            state = "NSW";
        } else if (pc.charAt(0) == "3") {
            state = "VIC";
        } else if (pc.charAt(0) == "4") {
            state = "QLD";
        } else if (pc.charAt(0) == "5") {
            state = "SA";
        } else if (pc.charAt(0) == "6") {
            state = "WA";
        } else if (pc.charAt(0) == "7") {
            state = "TAS";
        } else if (pc.substring(0,2) == "08" || pc.substring(0,2) == "09") {
            state = "NT";
        }
        $(pageName + " #State").val(state);
        $(pageName + " #State").selectmenu("refresh");
    }
}


