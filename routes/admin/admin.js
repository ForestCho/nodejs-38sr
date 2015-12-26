/*
 * GET user page.
 */  
exports.index = function(req, res) { 
        res.render('admin/index', {
            title: 'adminindex'
        }); 
} 