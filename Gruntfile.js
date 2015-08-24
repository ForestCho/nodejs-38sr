module.exports = function(grunt){
    //配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            concatcss: {
                src: ['source/stylesheets/about.css',
                     'source/stylesheets/article.css', 
                     'source/stylesheets/index.css',
                     'source/stylesheets/loginreg.css',
                     'source/stylesheets/message.css',
                     'source/stylesheets/nav.css',  
                     'source/stylesheets/reply.css',
                     'source/stylesheets/set.css',
                     'source/stylesheets/sidebar.css',
                     'source/stylesheets/topset.css',
                     'source/stylesheets/pubarticle.css',
                     'source/stylesheets/user.css',
                     'source/stylesheets/shijian.css',
                     'source/stylesheets/followlist.css',
                     ],
                dest: 'source/stylesheets/pagesty.css'
            }
        },
        uglify: {
            options: {
                banner: ''
            },
            bulid1: {
                src: 'source/javascripts/base.js',
                dest: 'public/javascripts/base.min.js'
            }, 
            bulid3: {
                src: 'source/javascripts/underscore.js',
                dest: 'public/javascripts/underscore.min.js'
            },
            bulid4: {
                src: 'source/javascripts/jquery.jcrop.js',
                dest: 'public/javascripts/jquery.jcrop.min.js'
            },
            bulid5: {
                src: 'source/javascripts/jquery.atwho.js',
                dest: 'public/javascripts/jquery.atwho.min.js'
            },
            bulid6: {
                src: 'source/javascripts/jquery.qeditor.js',
                dest: 'public/javascripts/jquery.qeditor.min.js'
            },        
            bulid7: {
                src: 'source/javascripts/admin.js',
                dest: 'public/javascripts/admin.min.js'
            },
            bulid8: {
                src: 'source/javascripts/texiao.js',
                dest: 'public/javascripts/texiao.min.js'
            }
        }, 
        cssmin: { 
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                //美化代码
                beautify: {
                    //中文ascii化，非常有用！防止中文乱码的神配置
                    ascii_only: true
                }
            },
            csscompact1: { 
                src: 'source/stylesheets/pagesty.css',
                dest: 'public/stylesheets/pagesty.min.css' 
            },    
            csscompact2: { 
                src: 'source/stylesheets/base.css',
                dest: 'public/stylesheets/base.min.css' 
            },    
            csscompact3: { 
                src: 'source/stylesheets/bootstrap.css',
                dest: 'public/stylesheets/bootstrap.min.css' 
            },    
            csscompact4: { 
                src: 'source/stylesheets/jcrop.css',
                dest: 'public/stylesheets/jcrop.min.css' 
            },
            csscompact5: { 
                src: 'source/stylesheets/jquery.qeditor.css',
                dest: 'public/stylesheets/jquery.qeditor.min.css' 
            },
            csscompact6: { 
                src: 'source/stylesheets/fancybox.css',
                dest: 'public/stylesheets/fancybox.min.css' 
            },
            csscompact7: { 
                src: 'source/stylesheets/admin.css',
                dest: 'public/stylesheets/admin.min.css' 
            },
        }
    });

    //载入concat和uglify插件，分别对于合并和压缩
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //注册任务
    grunt.registerTask('default', ['concat', 'uglify','cssmin']);

};