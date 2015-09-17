module.exports = function(grunt) {
    //配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            concatcss: {
                src: [
                    'source/stylesheets/bootstrap.css',
                    'source/stylesheets/about.css',
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
                    'source/stylesheets/base.css',
                    'source/stylesheets/admin.css',
                    'source/stylesheets/jcrop.css',
                    'source/stylesheets/jquery.atwho.css',
                    'source/stylesheets/jquery.qeditor.css',
                    'source/stylesheets/fancybox.css',
                    'source/stylesheets/jquery.webui.popover.css'
                ],
                dest: 'source/stylesheets/build.css'
            },     
            concatjs: {
                src: [ 
                    'source/javascripts/underscore.js',
                    'source/javascripts/bootstrap.js',
                    'source/javascripts/base.js', 
                    'source/javascripts/fancybox.js', 
                    'source/javascripts/admin.js',
                    'source/javascripts/texiao.js' 
                ],
                dest: 'source/javascripts/build.js'
            },     
            concatjs1: {
                src: [ 
                    'source/javascripts/jquery.js',
                    'source/javascripts/jquery.migrate.js',
                    'source/javascripts/jquery.caret.js',
                    'source/javascripts/jquery.atwho.js',
                    'source/javascripts/jquery.migrate.js',
                    'source/javascripts/jquery.jcrop.js',
                    'source/javascripts/jquery.qeditor.js',
                    'source/javascripts/jquery.webui.popover.js',
                    'source/javascripts/jquery.form.js'
                ],
                dest: 'source/javascripts/lib.js'
            }
        },
        uglify: {
            options: {
                banner: ''
            },
            bulid0: {
                src: 'source/javascripts/build.js',
                dest: 'public/javascripts/build.min.js'
            },
            bulid1: {
                src: 'source/javascripts/lib.js',
                dest: 'public/javascripts/lib.min.js'
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
                src: 'source/stylesheets/build.css',
                dest: 'public/stylesheets/build.min.css'
            },
        }
    });

    //载入concat和uglify插件，分别对于合并和压缩
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //注册任务
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

};