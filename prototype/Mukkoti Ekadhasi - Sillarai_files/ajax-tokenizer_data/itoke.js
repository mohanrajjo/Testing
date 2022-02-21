var onInputCount=0,inputStart,onInputInactiveId,charactersPerMsThreshold=getQueryVariable("swiperate",.08),inactivityTimeout=getQueryVariable("inactivityto",500),tokenizeWhenInactive="true"===getQueryVariable("tokenizewheninactive","false"),enhancedResponse="true"===getQueryVariable("enhancedresponse","false"),raiseEventOnInvalidInput="true"===getQueryVariable("invalidinputevent","false"),raiseEventOnInvalidCC="true"===getQueryVariable("invalidcreditcardevent","false"),raiseEventOnInvalidExpiry="true"===
getQueryVariable("invalidexpiryevent","false"),raiseEventOnInvalidCVV="true"===getQueryVariable("invalidcvvevent","false"),autoFocus="true"===getQueryVariable("autofocus","false"),formatInput="true"===getQueryVariable("formatinput","false"),swipeonly="true"===getQueryVariable("swipeonly","false"),placeholder=scrubInput(decodeURIComponent(getQueryVariable("placeholder","")),60,"",/^[ -~ÁÉÍÑÓÚÜáéíñóúüâçèêîôûãõàäößāēīōūёйъыэщ]+$/),placeholderMonth=getQueryVariable("placeholdermonth",null),placeholderYear=
getQueryVariable("placeholderyear",null),placeholderCVV=getQueryVariable("placeholdercvv",null),tokenPropName=scrubInput(getQueryVariable("tokenpropname","message"),30,"message",/^[0-9a-zA-Z]+$/),cardNumberName=scrubInput(decodeURI(getQueryVariable("cardnumbername","ccnumfield")),30,"ccnumfield",/^[0-9a-zA-Z]+$/),generateUniqueToken="true"===getQueryVariable("unique","false"),fullMobileKeyboard="true"===getQueryVariable("fullmobilekeyboard","false"),cardNumberNumericOnly="true"===getQueryVariable("cardnumbernumericonly",
"false"),cvvNumericOnly="true"===getQueryVariable("cvvnumericonly","false"),useExpiry="true"===getQueryVariable("useexpiry","false"),useCVV="true"===getQueryVariable("usecvv","false"),sendCSSLoadedEvent="true"===getQueryVariable("sendcssloadedevent","false"),sendCardTypingEvent="true"===getQueryVariable("sendcardtypingevent","false"),maskedPanFromLastToken=null,lastToken=null,ccfield,ccexpirymonth,ccexpiryyear,cccvvfield,expiry=null,isTokenized=!1,cardLabel=scrubInput(decodeURIComponent(getQueryVariable("cardlabel",
"Card Number")),30,"Card Number",/^[ -~]+$/),expiryLabel=scrubInput(decodeURI(getQueryVariable("expirylabel","Expiration Date")),30,"Expiration Date",/^[0-9a-zA-Z\s]+$/),cvvLabel=scrubInput(decodeURI(getQueryVariable("cvvlabel","CVV")),30,"CVV",/^[0-9a-zA-Z\s]+$/),orientation=scrubInput(getQueryVariable("orientation","default"),16,"default",/default|horizontal|vertical|custom/),cardtitle=scrubInput(decodeURI(getQueryVariable("cardtitle","Credit Card Number")),30,"Credit Card Number",/^[0-9a-zA-Z\s]+$/),
expirymonthtitle=scrubInput(decodeURI(getQueryVariable("expirymonthtitle","Expiration Month")),30,"Expiration Month",/^[0-9a-zA-Z\s]+$/),expiryyeartitle=scrubInput(decodeURI(getQueryVariable("expiryyeartitle","Expiration Year")),30,"Expiration Year",/^[0-9a-zA-Z\s]+$/),cvvtitle=scrubInput(decodeURI(getQueryVariable("cvvtitle","Card Verification Value")),30,"Card Verification Value",/^[0-9a-zA-Z\s]+$/),ccnumfieldMaxLength=scrubInput(getQueryVariable("cardinputmaxlength",2E3),4,2E3,/^[0-9]+$/),maskFirstTwo=
"true"===getQueryVariable("maskfirsttwo","false"),selectInputDelay=enforceBoundsOnNumber(getQueryVariable("selectinputdelay",0),0,1E3,0),usemonthnames="true"===getQueryVariable("usemonthnames","false"),useexpiryfield="true"===getQueryVariable("useexpiryfield","false"),monthNames=scrubInput(decodeURI(getQueryVariable("monthnames","January-February-March-April-May-June-July-August-September-October-November-December")),200,"January-February-March-April-May-June-July-August-September-October-November-December",
/^[0-9a-zA-Z\-\s.#ÁÉÍÑÓÚÜáéíñóúüâçèêîôûãõàäößāēīōūёйъыэщ]+$/),INVALID_ACCOUNT_NUMBER_ERROR_CODE="1001",INVALID_CVV_ERROR_CODE="1002",INVALID_EXPIRY_ERROR_CODE="1003",CREDIT_CARD_NUMBER_REQUIRED_ERROR_CODE="1004",CVV_REQUIRED_ERROR_CODE="1005",EXPIRY_REQUIRED_ERROR_CODE="1006",defaultExpiryGap=30,horizontalExpiryGap=12,cvvGap=12,defaultMonthNames="January February March April May June July August September October November December".split(" "),relaxedCharactersDropCssRegex=/[\{\}]+/,expiryYearMaxOffset=
19;function nameField(a){var b=document.getElementById(a);b.value="";b.setAttribute("name",a+Math.floor(1E7*Math.random()))}function getQueryVariable(a,b){for(var d=window.location.search.substring(1).split("\x26"),c=0;c<d.length;c++){var e=d[c].split("\x3d");if(e[0]==a&&2==e.length)return e[1]}return b||""===b?b:!1}var cssUrl=getQueryVariable("cssurl"),cssText=getQueryVariable("css");
cssUrl&&!relaxedCharactersDropCssRegex.exec(cssUrl)?sanitizeCss(getCssProxyUrl()+"?cssurl\x3d"+cssUrl):cssText&&!relaxedCharactersDropCssRegex.exec(cssText)?sanitizeCss(getCssProxyUrl()+"?css\x3d"+cssText):sendCSSReady(!0);function sanitizeCss(a){var b=getXhr();b.onreadystatechange=function(){4==b.readyState&&200==b.status&&appendSanitizedCss(b.responseText)};b.open("GET",a,!0);b.send(null)}
function appendSanitizedCss(a){var b=document.getElementsByTagName("head")[0],d=document.createElement("style");d.type="text/css";d.styleSheet?d.styleSheet.cssText=a:d.appendChild(document.createTextNode(a));b.appendChild(d);sendCSSReady(!0)}
function clearInputs(){if(isTokenized&&(useExpiry||useCVV)){isTokenized=!1;ccfield.value="";useexpiryfield&useExpiry?(ccexpirymonth.value="",ccexpiryyear.value=""):useExpiry&&(ccexpirymonth.options[0].selected="selected",ccexpiryyear.options[0].selected="selected");cccvvfield.value="";var a={};a[tokenPropName]="";a.expiry="";window.parent.postMessage(JSON.stringify(a),"*")}}var previousIsCardTypingValue=!1;
function sendCardTyping(a){if(sendCardTypingEvent){if(previousIsCardTypingValue!==a){var b={};b.cardTyping=a;window.parent.postMessage(JSON.stringify(b),"*")}previousIsCardTypingValue=a}}
function sendValidationErrors(){var a=isSwipe(),b=a?"swipe":"manual",d=formatInput&&!a?ccfield.value.replace(/ /g,""):ccfield.value,c="",e="",g=0,f=0,h=new Date;useexpiryfield&&useExpiry?(c=ccexpirymonth.value,e=ccexpiryyear.value):useExpiry&&(c=ccexpirymonth.options[ccexpirymonth.selectedIndex].value,e=ccexpiryyear.options[ccexpiryyear.selectedIndex].value,g=parseInt(c),f=parseInt(e));var k=cccvvfield.value,l=(new Date).getFullYear();""===d?raiseEventOnInvalidCC?sendValidationError("Credit Card Number is Required",
CREDIT_CARD_NUMBER_REQUIRED_ERROR_CODE,b):raiseEventOnInvalidInput&&sendValidationError("Invalid Account Number",INVALID_ACCOUNT_NUMBER_ERROR_CODE,b):a||isValidLengthAndFormat(d)||(raiseEventOnInvalidCC||raiseEventOnInvalidInput)&&sendValidationError("Invalid Account Number",INVALID_ACCOUNT_NUMBER_ERROR_CODE,b);useExpiry&&!a&&(!useexpiryfield&&"--"===c||""===c?raiseEventOnInvalidExpiry&&sendValidationError("Expiry is Required",EXPIRY_REQUIRED_ERROR_CODE,b):!useexpiryfield&&"--"===e||""===e?raiseEventOnInvalidExpiry&&
sendValidationError("Expiry is Required",EXPIRY_REQUIRED_ERROR_CODE,b):c.match(/(^0?[1-9]$)|(^1?[0-2]$)/)&&""!==c?useExpiry&&!a&&(h.getMonth()+1>g&&h.getFullYear()===f||h.getFullYear()>f)||"--"===c||"--"===e?"--"===c||"--"===e||useexpiryfield||raiseEventOnInvalidExpiry&&sendValidationError("Invalid Expiry",INVALID_EXPIRY_ERROR_CODE,b):isNumberWithinInclusiveRange(e,l,l+expiryYearMaxOffset)||""===e||(ccexpiryyear.className="error",raiseEventOnInvalidExpiry&&sendValidationError("Invalid Expiry",INVALID_EXPIRY_ERROR_CODE,
b)):""!==c&&(ccexpirymonth.className="error",raiseEventOnInvalidExpiry&&sendValidationError("Invalid Expiry",INVALID_EXPIRY_ERROR_CODE,b)));useCVV&&""===k?raiseEventOnInvalidCVV&&sendValidationError("CVV is Required",CVV_REQUIRED_ERROR_CODE,b):!useCVV||a||k.match(/^[0-9]{3,4}$/)||""===k||(raiseEventOnInvalidCVV&&sendValidationError("Invalid CVV",INVALID_CVV_ERROR_CODE,b),""!==cccvvfield.value&&(cccvvfield.className="error"))}
function getToken(){var a=isSwipe(),b=a?"swipe":"manual",d=formatInput&&!a?ccfield.value.replace(/ /g,""):ccfield.value,c=null,e=null,g=new Date,f=null;if(a||isValidLengthAndFormat(d)){(useExpiry||useCVV)&&(raiseEventOnInvalidExpiry||raiseEventOnInvalidCVV)&&sendValidationErrors();if(useExpiry&&!a){if(useexpiryfield){c=ccexpirymonth.value;if(c.match(/(^0?[1-9]$)|(^1?[0-2]$)/)&&""!==c)c=parseInt(c);else{""!==c&&(ccexpirymonth.className="error");return}var e=ccexpiryyear.value,h=(new Date).getFullYear();
if(isNumberWithinInclusiveRange(e,h,h+expiryYearMaxOffset))e=parseInt(e),ccexpiryyear.className="";else{""!==e&&(ccexpiryyear.className="error");return}}else c=ccexpirymonth.options[ccexpirymonth.selectedIndex].value,e=ccexpiryyear.options[ccexpiryyear.selectedIndex].value,"--"!==c&&(c=parseInt(c),ccexpirymonth.className=""),"--"!==e&&(e=parseInt(e),ccexpiryyear.className="");expiry=e.toString()+c.toString()}useCVV&&!a&&(f=cccvvfield.value);if(useExpiry&&!a&&(g.getMonth()+1>c&&g.getFullYear()===e||
g.getFullYear()>e)||"--"===c||"--"===e)"--"===c||"--"===e||useexpiryfield||(ccexpirymonth.className="error",ccexpiryyear.className="error");else if(!useCVV||a||f.match(/^[0-9]{3,4}$/)){if(null!==f&&f.match(/^[0-9]{4,4}$/))cccvvfield.className="";else if(null!==f&&f.match(/^[0-9]{3,3}$/)&&(cccvvfield.className="",0===d.indexOf("34")||0===d.indexOf("37")))return;c=getHostUrl()+"/cardsecure/api/v1/ccn/tokenize";e=function(a){processToken(a,b,d)};a?tokenizeSwipe(d,c,e,expiry,f):tokenizeManualInput(d,
c,e,expiry,f)}else""!==f&&""!==cccvvfield.value&&(cccvvfield.className="error")}else maskedPanFromLastToken!==ccfield.value?(ccfield.className="error",useExpiry||useCVV?sendValidationErrors():raiseEventOnInvalidInput&&sendValidationError("Invalid Account Number",INVALID_ACCOUNT_NUMBER_ERROR_CODE,b)):(a={},a[tokenPropName]=lastToken,a.expiry=expiry,enhancedResponse&&addEnhancedResponseFieldsToResponseObject(a,lastToken,b),window.parent.postMessage(JSON.stringify(a),"*"))}
function sendValidationError(a,b,d){var c={};c[tokenPropName]="";c.expiry=void 0;c.validationError=a;enhancedResponse&&(c.token="",c.errorCode=b,c.errorMessage=a,c.entry=d);window.parent.postMessage(JSON.stringify(c),"*")}function sendCSSReady(a){if(sendCSSLoadedEvent){var b={};b.cssLoaded=a;window.parent.postMessage(JSON.stringify(b),"*")}}function tokenizeSwipe(a,b,d,c,e){tokenize("CZ",a,b,d,c,e)}
function tokenizeManualInput(a,b,d,c,e){var g=getHostUrl();getPublicKey(g+"/cardsecure/api/v1/retrievePublicKey",function(f){var g=new JSEncrypt;f=f.replace("-----BEGIN PUBLIC KEY-----","");f=f.replace("-----END PUBLIC KEY-----","");g.setPublicKey(f);f=g.encrypt(a);tokenize("CR",f,b,d,c,e)},function(){tokenize("CE",a,b,d,c,e)})}
function tokenize(a,b,d,c,e,g){var f=getXhr();f.onreadystatechange=function(){4===f.readyState&&200===f.status&&c(f.responseText)};f.open("POST",d,!0);f.setRequestHeader("Content-Type","application/json");d={};d="CZ"===a?{devicedata:b,source:"iToke",encryptionhandler:"RSA",unique:!1}:{account:b,source:"iToke",encryptionhandler:null,unique:!1,expiry:e,cvv:g};"CR"===a&&(d.encryptionhandler="RSA");generateUniqueToken&&(d.unique=!0);f.send(JSON.stringify(d))}
function getPublicKey(a,b,d){var c=getXhr();c.onreadystatechange=function(){if(4===c.readyState&&200===c.status){var a=JSON.parse(c.responseText);b(a.publickey)}else 4===c.readyState&&200!==c.status&&d()};c.open("POST",a,!0);c.setRequestHeader("Content-Type","application/json");c.send(JSON.stringify({encryptionHandler:"RSA"}))}
function isValidLengthAndFormat(a){var b=a.length;if(-1<a.indexOf("/")){var d=a.substring(0,a.indexOf("/"));a=a.substring(a.indexOf("/")+1);var c=d.length;return 10<=b&&27>=b&&isNumeric(d)&&isNumeric(a)&&(8===c||9===c)}return 14<=b&&19>=b&&isNumeric(a)&&luhnCheck(a)}function isNumberWithinInclusiveRange(a,b,d){a=parseInt(a);return!isNaN(a)&&a>=b&&a<=d}
function isSwipe(){var a=ccfield.value;return 19<a.length&&(matchT1(a)||matchT2(a)||isIDTechSREDSwipe(a)||0===a.indexOf("DFEE25")&&isValidHex(a)||(0===a.indexOf("%B")||0===a.indexOf(";")||0===a.indexOf("M1"))&&10<=a.split("|").length-1)}function isIDTechSREDSwipe(a){return 0===a.indexOf("02")&&isValidHex(a.substr(0,16))&&endsWith(a,"03")}function isValidHex(a){return null!=a.match(/\b[0-9A-Fa-f]+\b/gi)}function isNumeric(a){return!isNaN(parseFloat(a))&&isFinite(a)}
function endsWith(a,b){var d=b.length;return a.length>=d?a.substr(a.length-d)===b:!1}function luhnCheck(a){var b=a.substring(0,a.length-1);a=parseInt(a.charAt(a.length-1),10);for(var d=0,c=!0,e=b.length-1;0<=e;e--){var g=parseInt(b.charAt(e),10);c&&(g*=2,g=9<g?g-9:g);d+=g;c=!c}return a===9*d%10}function getHostUrl(){var a=window.location.port,b=window.location.protocol+"//"+window.location.hostname;a&&(b=b+":"+a);return b}
function getCssProxyUrl(){var a=getHostUrl(),b=window.location.pathname.split("/");return a+"/"+b[1]+"/css-sanitize"}function monthNameToNumber(a){var b=monthNames.split("-"),d=1,c={},e;for(e in b)c[e]=d,++d;return c[a.lowercase()]}function monthNumberToName(a){var b;b=monthNames.split("-");return 12<=b.length?b[a-1]:defaultMonthNames[a-1]}
function getXhr(){var a=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0","Msxml2.XMLHTTP"];if(window.ActiveXObject){for(var b=0;b<a.length;b++)try{return new ActiveXObject(a[b])}catch(d){}throw Error("XMLHttpRequest not supported");}if(window.XMLHttpRequest)return new XMLHttpRequest;throw Error("XMLHttpRequest not supported");}
function processToken(a,b,d){a=getData(a);ccfield.value=getMaskedPan(d,a);maskedPanFromLastToken=ccfield.value;lastToken=a;expiry=isIDTechSREDSwipe(d)?getExpiryFromSwipe(d):expiry;d={};d[tokenPropName]=a;null!==expiry&&(d.expiry=expiry);enhancedResponse&&addEnhancedResponseFieldsToResponseObject(d,a,b);isTokenized=!0;window.parent.postMessage(JSON.stringify(d),"*");ccfield.style.borderColor="";sendCardTyping(!1)}
function addEnhancedResponseFieldsToResponseObject(a,b,d){var c=getErrorResponseDetails(b);null==c?(a.token=b,a.errorCode="0",a.errorMessage=""):(a.token="",a.errorCode=c.errorCode,a.errorMessage=c.errorMessage);a.entry=d;return a}function getErrorResponseDetails(a){a=decodeURIComponent(a);a=/^([0-9]{4})(::)(.*)$/.exec(a);return null!=a?{errorCode:a[1],errorMessage:a[3].replace(/\+/g," ")}:null}
function getMaskedPan(a,b){var d;if(isSwipe()||-1!==a.indexOf("/")){if(!isSwipe()&&-1<a.indexOf("/"))return b=a.substring(0,a.indexOf("/")),a=a.substring(a.indexOf("/")+1),a=4<a.length?Array(a.length-3).join("*")+a.substring(a.length-4):"****",b+"/"+a;if(d=matchT1(a))return b=d[1],a=maskFirstTwo?"**":b.substr(2,2),d=b.substr(b.length-5,4),a+Array(b.length-8).join("*")+d;if(d=matchT2(a))return b=d[1],a=maskFirstTwo?"**":b.substr(1,2),d=b.substr(b.length-5,4),a+Array(b.length-7).join("*")+d;a=maskFirstTwo?
"**":b.substr(1,2);d=b.substr(b.length-4,4);return a+Array(b.length-7).join("*")+d}return maskFirstTwo?"**"+Array(a.length-6).join("*")+a.substring(a.length-4,a.length):a.substring(0,2)+Array(a.length-6).join("*")+a.substring(a.length-4,a.length)}function getExpiryFromSwipe(a){var b=null,d=matchT1(a);null!==d&&(b=nullIfUndefined(d[2]));null===b&&(a=matchT2(a),null!==a&&(b=nullIfUndefined(a[2])));return b}function matchT1(a){return a.match(/(%.[0-9]{2}.{7,13}[0-9]{4}\^).{2,26}\^([0-9]{4})?/)}
function matchT2(a){return a.match(/(;[0-9]{2}.{7,13}[0-9]{4}=)([0-9]{4})?/)}function nullIfUndefined(a){return void 0===a?null:a}function onCCNumFieldKeyUp(){var a=formatInput?ccfield.value.replace(/ /g,""):ccfield.value;null!==maskedPanFromLastToken?a===maskedPanFromLastToken||isValidLengthAndFormat(a)?ccfield.className="":ccfield.className="error":"error"===ccfield.className&&isValidLengthAndFormat(a)&&(ccfield.className="");sendCardTyping(!0)}
function getData(a){a=JSON.parse(a);return a.hasOwnProperty("token")?a.token:""}
function formatCreditCardField(a){if("ccnumfield"===a.target.id){var b=ccfield.value[0];if("input"===a.type&&("2"===b||"3"===b||"4"===b||"5"===b||"6"===b)){var d=ccfield.value,c=d.replace(/ /g,"");a=ccfield.selectionStart;var e=ccfield.value.length;if(1<c.length&&19>=c.length&&isNumeric(c)){if(b=0===c.indexOf("34")||0===c.indexOf("37")?/(\d{1,4})(\d{1,6})?(\d{1,5})?/:/(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?(\d{1,3})?/,c=c.match(b))if(c.shift(),ccfield.value=c.join(" ").trim(),a!==e)e=d.substring(0,
a),d=0,-1===e.indexOf(" ")&&(c=e.match(b))&&(c.shift(),d=(c.join(" ").trim().match(/ /g)||[]).length),setCaretPosition(a+d)}else 9<=c.length&&27>=c.length&&-1<c.indexOf("/")&&-1<ccfield.value.indexOf(" ")&&(ccfield.value=c,a!==e&&(e=d.substring(0,a),d=(e.match(/ /g)||[]).length,setCaretPosition(a-d)))}}}function setCaretPosition(a){if(ccfield.createTextRange){var b=ccfield.createTextRange();b.move("character",a);b.select()}else ccfield.selectionStart&&ccfield.setSelectionRange(a,a)}
function scrubInput(a,b,d,c){return a&&0!==a.length&&a.length<=b&&a.match(c)?a:d}function enforceBoundsOnNumber(a,b,d,c){return isInt(a)&&a>=b&&a<=d?a:c}function isInt(a){return!isNaN(a)&&parseInt(Number(a))==a&&!isNaN(parseInt(a,10))}
function onInput(a){var b=a.target||a.srcElement;isInputDisallowedForElement(b)?(console.log("Ignoring input event for element with ID: "+b.id),isElementOfType(b,"select")&&resetSelectElement(b)):(onInputInactiveId&&clearTimeout(onInputInactiveId),inputStart||(inputStart=(new Date).getTime()),onInputCount++,onInputInactiveId=setTimeout(onInputInactive,inactivityTimeout),formatInput&&formatCreditCardField(a),clearInputs())}
function onInputInactive(){if(tokenizeWhenInactive)getToken();else{var a=(new Date).getTime()-inputStart,a=onInputCount/a;0<charactersPerMsThreshold&&a>=charactersPerMsThreshold?getToken():swipeonly&&(document.getElementById("ccnumfield").value="")}inputStart=null;onInputCount=0}
function addExpiryField(){var a=document.getElementById("tokenform");ccexpirymonth=document.getElementById("ccexpiryfieldmonth");ccexpirymonth.title=expirymonthtitle;ccexpirymonth.setAttribute("aria-label",expirymonthtitle);ccexpirymonth.oninput=onInput;ccexpirymonth.setAttribute("type","text");placeholderMonth&&(ccexpirymonth.placeholder=scrubInput(decodeURIComponent(placeholderMonth),30,"",/^[0-9a-zA-Z\s.#]+$/));a.insertBefore(ccexpirymonth,cccvvfield);tokenizeWhenInactive||(ccexpirymonth.onblur=
getToken);ccexpiryyear=document.getElementById("ccexpiryfieldyear");ccexpiryyear.setAttribute("type","text");ccexpiryyear.title=expiryyeartitle;ccexpiryyear.setAttribute("aria-label",expiryyeartitle);ccexpiryyear.oninput=onInput;placeholderYear&&(ccexpiryyear.placeholder=scrubInput(decodeURIComponent(placeholderYear),30,"",/^[0-9a-zA-Z\s.#]+$/));var b=document.createElement("label");b.innerText="/";b.setAttribute("for","ccexpiryfieldyear");"default"===orientation&&(ccexpiryyear.style.marginLeft=defaultExpiryGap/
2-2+"px",ccexpirymonth.style.marginRight=defaultExpiryGap/2-2+"px");"horizontal"===orientation&&(ccexpiryyear.style.marginLeft=horizontalExpiryGap/2-2+"px",ccexpirymonth.style.marginRight=horizontalExpiryGap/2-2+"px",useCVV&&(ccexpiryyear.style.marginRight=horizontalExpiryGap+"px"));a.insertBefore(ccexpiryyear,cccvvfield);tokenizeWhenInactive||(ccexpiryyear.onblur=getToken);var d=document.createElement("br"),c=document.createElement("label");c.innerText=expiryLabel;c.setAttribute("for","ccexpiryfieldmonth");
c.id="ccexpirylabel";"horizontal"===orientation&&(c.style.marginRight=horizontalExpiryGap+"px");var e=document.createElement("br");"custom"!==orientation&&a.insertBefore(d,ccexpirymonth);a.insertBefore(c,ccexpirymonth);"custom"!==orientation&&a.insertBefore(e,ccexpirymonth);"vertical"===orientation&&(b=document.createElement("br"));a.insertBefore(b,ccexpiryyear)}
function addExpiry(){var a=document.getElementById("tokenform");ccexpirymonth=document.createElement("select");ccexpirymonth.title=expirymonthtitle;ccexpirymonth.setAttribute("aria-label",expirymonthtitle);ccexpirymonth.id="ccexpirymonth";allowInputForElement(ccexpirymonth);a.insertBefore(ccexpirymonth,cccvvfield);var b=document.createElement("option");b.text="--";b.value="--";ccexpirymonth.add(b);for(i=1;12>=i;++i)b=document.createElement("option"),b.text=usemonthnames?monthNumberToName(i):10>i?
"0"+i:i,b.value=i,ccexpirymonth.add(b);ccexpiryyear=document.createElement("select");ccexpiryyear.title=expiryyeartitle;ccexpiryyear.setAttribute("aria-label",expiryyeartitle);ccexpiryyear.id="ccexpiryyear";allowInputForElement(ccexpiryyear);"default"===orientation&&(ccexpiryyear.style.marginLeft=defaultExpiryGap+"px");"horizontal"===orientation&&(ccexpiryyear.style.marginLeft=horizontalExpiryGap+"px",useCVV&&(ccexpiryyear.style.marginRight=horizontalExpiryGap+"px"));a.insertBefore(ccexpiryyear,cccvvfield);
b=document.createElement("option");b.text="--";b.value="--";ccexpiryyear.add(b);for(var d=(new Date).getFullYear(),c=d;c<=d+expiryYearMaxOffset;c++)b=document.createElement("option"),b.text=c.toString(),b.value=c.toString(),ccexpiryyear.add(b);b=document.createElement("br");d=document.createElement("label");d.innerText=expiryLabel;d.setAttribute("for","ccexpirymonth");d.id="ccexpirylabel";"horizontal"===orientation&&(d.style.marginRight=horizontalExpiryGap+"px");c=document.createElement("br");"custom"!==
orientation&&a.insertBefore(b,ccexpirymonth);a.insertBefore(d,ccexpirymonth);"custom"!==orientation&&a.insertBefore(c,ccexpirymonth);"vertical"===orientation&&(b=document.createElement("br"),a.insertBefore(b,ccexpiryyear))}
function addCVV(){var a=document.getElementById("tokenform");cccvvfield=document.getElementById("cccvvfield");cccvvfield.title=cvvtitle;cccvvfield.setAttribute("aria-label",cvvtitle);cccvvfield.oninput=onInput;cccvvfield.onkeydown=onCvvNumKeyDown;placeholderCVV&&(cccvvfield.placeholder=scrubInput(decodeURIComponent(placeholderCVV),30,"",/^[0-9a-zA-Z\s.#]+$/));cccvvfield.setAttribute("type",fullMobileKeyboard?"text":"tel");tokenizeWhenInactive||(cccvvfield.onblur=getToken);var b=document.createElement("br");
"horizontal"===orientation&&useExpiry||"custom"===orientation||a.insertBefore(b,cccvvfield);b=document.createElement("label");b.innerText=cvvLabel;b.setAttribute("for","cccvvfield");b.id="cccvvlabel";"horizontal"===orientation&&useExpiry&&(b.style.marginRight=cvvGap+"px");var d=document.createElement("br");if("horizontal"===orientation&&useExpiry){a.insertBefore(b,ccexpirymonth.previousElementSibling);var c=cccvvfield.getBoundingClientRect();b.style.position="absolute";b.style.left=c.x+"px"}else a.insertBefore(b,
cccvvfield);"horizontal"===orientation&&useExpiry||"custom"===orientation||a.insertBefore(d,cccvvfield)}function onCardNumKeyDown(a){var b=a.keyCode||a.charCode;if((a.shiftKey||!(48<=b&&57>=b||46===b||8===b||35<=b&&40>=b||96<=b&&105>=b)&&9!==b)&&cardNumberNumericOnly)return!1}function onCvvNumKeyDown(a){var b=a.keyCode||a.charCode;if((a.shiftKey||!(48<=b&&57>=b||46===b||8===b||35<=b&&40>=b||96<=b&&105>=b)&&9!==b)&&cvvNumericOnly)return!1}
function isInputDisallowedForElement(a){return"true"===a.getAttribute("data-disallowinput")}function allowInputForElement(a){a.setAttribute("data-disallowinput","false")}function disallowInputForElement(a){a.setAttribute("data-disallowinput","true")}function isElementOfType(a,b){return a.tagName.toLowerCase()===b}function resetSelectElement(a){for(var b=a.options,d=0;d<b.length;d++)if(b[d].defaultSelected){a.selectedIndex=d;return}a.selectedIndex=0}
function addSelectElementEventListeners(){for(var a=document.getElementsByTagName("select"),b=0;b<a.length;b++)0<selectInputDelay&&a[b].addEventListener("focus",function(){var a=this;disallowInputForElement(a);setTimeout(function(){allowInputForElement(a)},selectInputDelay)},!1),tokenizeWhenInactive?a[b].addEventListener("focusout",function(a){isTokenized||onInput(a)}):a[b].addEventListener("blur",getToken),a[b].addEventListener("input",onInput)}
function onLoad(){ccfield=document.getElementById("ccnumfield");cccvvfield=document.getElementById("cccvvfield");var a=document.getElementById("ccnumfield");a.size=formatInput?24:19;a.oninput=onInput;a.onpropertychange=a.oninput;a.title=cardtitle;a.setAttribute("aria-label",cardtitle);a.onkeydown=onCardNumKeyDown;a.maxLength=ccnumfieldMaxLength;a.setAttribute("name",cardNumberName);tokenizeWhenInactive||(a.onblur=getToken);a.onkeyup=onCCNumFieldKeyUp;fullMobileKeyboard&&(a.type="text");autoFocus&&
a.focus();placeholder&&(a.placeholder=placeholder);a=document.getElementById("tokenform");useExpiry&&(useexpiryfield?addExpiryField():addExpiry());useCVV&&addCVV();if(useExpiry||useCVV){var b=document.createElement("label");b.innerHTML=cardLabel;b.setAttribute("for","ccnumfield");b.id="cccardlabel";var d=document.createElement("br");a.insertBefore(b,ccfield);"custom"!==orientation&&a.insertBefore(d,ccfield)}addSelectElementEventListeners();a=document.createElement("script");a.src="js/jsencrypt.min.js";
document.getElementsByTagName("head")[0].appendChild(a)};