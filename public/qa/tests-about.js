suite('"About" Page Tests',function(){
    test('page should contain link to content page',function(){
        assert($('a[href="/contact"]').length);
    });
});