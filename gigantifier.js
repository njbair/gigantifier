var updateURITimer;

(function($){
    $(function(){
        function getURIParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        function getURIData() {
            // check for URI segments first, then query strings
            console.log(window.location.pathname.split('/'));
            if (window.location.pathname.split('/')[1] === 't') {
                return atob(window.location.pathname.split('/')[2]);
            }
            else if (getURIParameterByName('t') !== '') {
                return atob(getURIParameterByName('t'));
            }

            return false;
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

        function gigantify() {
            var newOutput = $('#appInput').val();
            var newHash = newOutput !== '' ? '/t/' + btoa(newOutput) : '/';
            var formattedOutput = formatOutput(newOutput);

            $('#appOutput').html(formattedOutput.replaced);

            clearTimeout(updateURITimer);
            updateURITimer = setTimeout(function(){
                window.history.pushState({}, formattedOutput.stripped, newHash);
                document.title = formattedOutput.stripped;
            }, 1000);
        }

        function init() {
            var uriData = getURIData();

            $(window)
                .keydown(function(e){
                    if (e.which === 13) {
                        $('#appControls').toggleClass('hidden');
                        $('#appControls:not(.hidden) #appInput').select().focus();
                    }
                });

            $('#appInput')
                .keydown(function(e){
                    /*
                    if (e.which === 13) {
                        $('#appControls').toggleClass('hidden');
                    }
                    else
                    {
                        setTimeout(gigantify, 30);
                    }
                    */
                    setTimeout(gigantify, 30);
                })
                .focus();

            $('#appControlsToggle')
                .click(function(e){
                    e.preventDefault();
                    $('#appControls').toggleClass('hidden');
                });

            if (uriData) {
                $('#appInput').val(uriData);
                gigantify();
            }
            else {
                $('#appControls').removeClass('hidden');
            }
        }

        init();
    });
}(jQuery));
