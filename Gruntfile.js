module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %>\n' + '* <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;',
        clean: {
            build: {
                src: ['static']
                // filter: 'isFile'
            }
        },
        copy: {
            html: {
                files: [
                    {expand: true, cwd: 'src/', src: [
                      'aboutus/**/*.html',
                      'agreement/**/*.html',
                      'commission_center/**/*.html',
                      'common/**/*.html',
                      'findpwd/**/*.html',
                      'help_center/**/*.html',
                      'home/**/*.html',
                      'login/**/*.html',
                      'order_center/**/*.html',
                      'order_mgmt/**/*.html',
                      'register/**/*.html',
                      'user_center/**/*.html'
                    ], dest: 'static/'}
                ]
            },
            htmlIndex: {
              src:"pageError_dev.html",
              dest: 'pageError.html'
            },
            images: {
                files: [
                    {
                        expand: true, 
                        cwd: 'src/', 
                        src: ['images/**/*.{png,jpg,jpeg,gif,mp4,svg}'], 
                        dest: 'static/'
                    }
                ]
            },
            data:{
                files: [
                    {expand: true, cwd: 'src/', src: ['jsonData/*.json'], dest: 'static/'}
                ]
            },
            fonts:{
                files: [
                    {expand: true, cwd: 'src/', src: ['font/*'], dest: 'static/'}
                ]
            }
        },
        usemin: {
            others:{
              src: ['static/**/*.html','pageError.html']
            }
        },
        concat:{
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %>\n' +
                         ' * <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            js_base: {
                files: {'static/js/base/base.min.js': ["src/js/base/zcFuns.js","src/js/base/base.js"]}
            },
            js_widget: {
                files: {'static/js/widget/widget.min.js': "src/js/widget/**/*.js"}
            },
            js_page: {
                files: [
                    {expand: true, cwd: 'src/', src: ['js/page/*'], dest: 'static/'}
                ]
            }
        },
        uglify: {
            options: {
                compress: {
                  drop_console: true
                },
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %>\n' +
                         ' * <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            main: {
                files: [{
                    expand:true,
                    cwd:'static',//js目录下
                    src:['**/*.js'],//所有js文件
                    dest: 'static/'//输出到此目录下
                }]
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0 /* 移除 CSS 文件中的所有注释 */
            },
            css_base: {
                files: {
                    'static/css/base/base.min.css': "src/css/base/*.css"
                }
            },
            css_page: {
                files: [{
                    expand: true,
                    cwd: 'src/css/page',
                    src: ['*.css'],
                    dest: 'static/css/page',
                    ext: '.min.css'
                }]
            },
            css_widget: {
                files: {
                    'static/css/widget/widget.min.css': "src/css/widget/*.css"
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('default', ['clean','copy','concat','uglify','cssmin','usemin']);
    grunt.registerTask('cleans', ['clean']);
    grunt.registerTask('usemins', ['usemin']);
    grunt.registerTask('uglifys', ['uglify']);
    grunt.registerTask('cssmins', ['cssmin']);
    grunt.registerTask('concats', ['concat']);
    grunt.registerTask('lint', ['jshint', 'csslint']);
    grunt.registerTask('copys', ['copy']);
};
