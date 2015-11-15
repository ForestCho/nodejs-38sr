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
                    'source/stylesheets/jquery.webui.popover.css',
                    'source/stylesheets/zoom.css',
                    'source/stylesheets/pretty.css',
                    'source/stylesheets/editor.css'
                ],
                dest: 'source/stylesheets/build.css'
            },     
            concatjs: {
                src: [ 
                    'source/javascripts/underscore.js',
                    'source/javascripts/bootstrap.js',
                    'source/javascripts/base.js',  
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
                    'source/javascripts/jquery.jcrop.js', 
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
            },
            bulid2: {
                src: 'source/javascripts/underscore.js',
                dest: 'public/javascripts/lib/underscore.min.js'
            },
            bulid3: {
                src: 'source/javascripts/bootstrap.js',
                dest: 'public/javascripts/lib/bootstrap.min.js'
            }, 
            bulid5: {
                src: 'source/javascripts/jquery.js',
                dest: 'public/javascripts/lib/jquery.min.js'
            },
            bulid6: {
                src: 'source/javascripts/jquery.js',
                dest: 'public/javascripts/lib/jquery.min.js'
            },
            bulid7: {
                src: 'source/javascripts/jquery.migrate.js',
                dest: 'public/javascripts/lib/jquery.migrate.min.js'
            },
            bulid8: {
                src: 'source/javascripts/jquery.caret.js',
                dest: 'public/javascripts/lib/jquery.caret.min.js'
            },
            bulid9: {
                src: 'source/javascripts/jquery.atwho.js',
                dest: 'public/javascripts/lib/jquery.atwho.min.js'
            },
            bulid10: {
                src: 'source/javascripts/jquery.jcrop.js',
                dest: 'public/javascripts/lib/jquery.jcrop.min.js'
            },
            bulid11: {
                src: 'source/javascripts/jquery.webui.popover.js',
                dest: 'public/javascripts/lib/jquery.webui.popover.min.js'
            },
            bulid11: {
                src: 'source/javascripts/jquery.form.js',
                dest: 'public/javascripts/lib/jquery.form.min.js'
            },
            bulid12: {
                src: 'source/javascripts/jquery.webui.popover.js',
                dest: 'public/javascripts/lib/jquery.webui.popover.min.js'
            },
            bulid12: {
                src: 'source/javascripts/editor.js',
                dest: 'public/javascripts/lib/editor.min.js'
            },
            bulid13: {
                src: 'source/javascripts/zoom.js',
                dest: 'public/javascripts/lib/zoom.min.js'
            },      
            bulid14: {
                src: 'source/javascripts/pretty.js',
                dest: 'public/javascripts/lib/pretty.min.js'
            },                  
            bulid16: {
                src: 'source/javascripts/main.js',
                dest: 'public/javascripts/main.min.js'
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
        },
        watch: {
            css: {
                files: ['source/stylesheets/*.css'],
                tasks: ['concat','cssmin']
            },
            script: {
                files: ['source/javascripts/*.js'],
                tasks: ['uglify']
            }
        }
    });

    //载入concat和uglify插件，分别对于合并和压缩
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //注册任务
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin','watch']);

};