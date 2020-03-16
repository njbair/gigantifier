var updateURITimer;

(function($){
    $(function(){
        function getURIParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        function getURIData() {
            // check for URI segments first, then query strings
            if (window.location.pathname.split('/')[1] === 't') {
                return atob(window.location.pathname.split('/')[2]);
            }
            else if (getURIParameterByName('t') !== '') {
                return atob(getURIParameterByName('t'));
            }

            return false;
        }

        function getURIPrefix() {
            var re = /^(.*)(\/t\/(.*))?$/;
            var results = re.exec(window.location.pathname);

            console.log(results);
            return results[1] ? results[1] : "";
        }

        function formatOutput(output) {
            var regex = new RegExp('{{([^\\|]*)\\|([^}]*)}}', 'ig');
            var replaceString = '<span style="color: $1;">$2</span>';
            var stripString = '$2';

            return {
                'replaced': output.replace(regex, replaceString),
                'stripped': output.replace(regex, stripString)
            };
        }

        function gigantify(URIPrefix) {
            var newOutput = $('#appInput').val();
            var newHash = newOutput !== '' ? URIPrefix + '/t/' + btoa(newOutput) : URIPrefix;
            var formattedOutput = formatOutput(newOutput);

            $('#appOutput').html(formattedOutput.replaced);

            clearTimeout(updateURITimer);
            updateURITimer = setTimeout(function(){
                window.history.pushState({}, formattedOutput.stripped, newHash);
                document.title = formattedOutput.stripped;
            }, 1000);
        }

        function init() {
            var URIData = getURIData();
            var URIPrefix = getURIPrefix();

            $(window)
                .keydown(function(e){
                    if (e.which === 13) {
                        $('#appControls').toggleClass('hidden');
                        $('#appControls:not(.hidden) #appInput').select().focus();
                    }
                });

            $('#appInput')
                .keydown(function(e){
                    setTimeout(function(){
                        gigantify(URIPrefix)
                    }, 30);
                })
                .focus();

            $('#appControlsToggle')
                .click(function(e){
                    e.preventDefault();
                    $('#appControls').toggleClass('hidden');
                });

            if (URIData) {
                $('#appInput').val(URIData);
                gigantify(URIPrefix);
            }
            else {
                $('#appControls').removeClass('hidden');
            }
        }

        init();
    });
}(jQuery));
