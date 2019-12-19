(function(){
    var buttonReset = $('#button-reset');
    var modalSettings =$('#modal-settings')
    var buttonStart = $('#button-start');
    var divField = $('#field');
    var audioDrumroll = $('#audio-drumroll').get(0);
    var audioDrumfinish = $('#audio-drumfinish').get(0);

    // init number list and storage
    var maxNumber = 75;
    var numberListAll = [];
    for(var num = 1; num <= maxNumber; num++) {
        numberListAll.push(num);
    }
    var storage = localStorage;
    var listKey = 'bingo.numberlist';
    var removedKey = 'bingo.removedlist';
    var setNumberList = function(a) {
        storage.setItem(listKey, JSON.stringify(a));
    };
    var getNumberList = function() {
        return JSON.parse(storage.getItem(listKey));
    };
    var setRemovedList = function(a) {
        storage.setItem(removedKey, JSON.stringify(a));
    };
    var getRemovedList = function() {
        return JSON.parse(storage.getItem(removedKey));
    };
    var resetLists = function() {
        setNumberList(numberListAll.concat());
        setRemovedList([]);
    };

    // init field
    var toBingoString = function(n){
        if(n > 9) {
            return n.toString(10);
        } else if (n < 0) {
            return '00';
        } else {
            return '0' +  n.toString(10);
        }
    };
    var toBallIdString = function(n){
        return 'ball' + n.toString(10);
    };
    var addNumber = function(n) {
        divField.append('<p id="' + toBallIdString(n) + '" class="bingo-ball notwon">' + toBingoString(n) + '</p>');
    };
    var initField = function(){
        for(var num = 1; num <= maxNumber; num++) {
            addNumber(num);
            if (num % 10 == 0) {
                divField.append('<br>');
            }
        }
        var loadedNumberList = getNumberList();
        var loadedRemovedList = getRemovedList();
        if(loadedNumberList && loadedRemovedList) {
            for (var i = 0; i < loadedRemovedList.length; i++) {
                $('#' + toBallIdString(loadedRemovedList[i])).addClass('won');
            }
        } else {
            resetLists();
        }
    };
    initField();

    // create util method
    var getNumberRamdom = function(){
        var numberList = getNumberList();
        var i = Math.floor(Math.random() * numberList.length);
        return numberList[i];
    };
    var removeNumberRamdom = function(){
        var numberList = getNumberList();
        if(numberList.length === 0) {
            return -1;
        }
        var i = Math.floor(Math.random() * numberList.length);
        var removed = numberList[i];
        numberList.splice(i, 1);
        setNumberList(numberList);
        var removedList = getRemovedList();
        removedList.push(removed);
        setRemovedList(removedList);
        return removed;
    };

    // init start button
    var isStarted = false;
    function lotterying() {
        if(isStarted) {
            var ball = '#' + toBallIdString(getNumberRamdom());
            $(ball).toggleClass('lotterying');
            setTimeout(lotterying, 60);
        }
    };
    var stop = function(time) {
        isStarted = false;
        buttonStart.text('回転！');
        var n = removeNumberRamdom();
        $('.won-previous').removeClass('won-previous');
        $('.lotterying').removeClass('lotterying');
        $('#' + toBallIdString(n)).addClass('won won-previous');
        audioDrumroll.pause();
        audioDrumfinish.currentTime = 0;
        audioDrumfinish.play();
    };
    var start = function(){
        isStarted = true;
        buttonStart.text('ストップ！');
        audioDrumfinish.pause();
        audioDrumroll.currentTime = 0;
        audioDrumroll.play();
        lotterying();
    };
    var startClicked = function(e){
        if(isStarted) {
            stop(null);
        } else {
            start();
        }
    };
    buttonStart.click(startClicked);

    // init reset button
    var resetClicked = function() {
        if (confirm('Do you really want to reset?')) {
            resetLists();
            divField.empty();
            initField();
            modalSettings.modal('hide');
            audioDrumroll.pause();
            audioDrumfinish.pause();
            buttonStart.focus();
        }
    };
    buttonReset.click(resetClicked);

})();