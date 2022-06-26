
suite("Global Tests", function(){
    test('page is a valid title', function(){
        assert(document.title && document.title.match(/\S/) &&
        document.title.toUpperCase() !='TODO');
    });
});