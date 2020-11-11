(function($){
    var layer
    layui.use("layer",function(){
        layer = layui.layer    
    })
    $.fn.extend({
        initNavList:function(options){
            var defs = {
                data:""
            }
            var opts = $.extend({},defs,options)
            var $tabWrap = $(".nav-tab-list")
            var $tabList = $("#navTabList")
            var $iframeList = $("#iframeList")
            var dom = getListDom(opts.data)
            var _this = this
            this.append(dom)
            //打开心页面
            this.openNewPage = function(name,url){
                var isExist = false;
                var existIndex = 0;
                var isAllowed = isAllowOpenNewPage(name);
                if(!isAllowed){
                    layer.msg("标签列表长度超出标签可视区")
                    return false
                }
                $tabList.find("li").each(function(){
                    var thisName = $(this).find("span").text()
                    if(thisName == name){
                        existIndex = $(this).index()
                        isExist = true
                    }
                })
                if(isExist){
                    $tabList.find("li").eq(existIndex).addClass("active").siblings().removeClass("active")
                    $iframeList.find("iframe").eq(existIndex).show().siblings().hide()
                    return
                }
                var newTab = "<li class='active'><span>"+name+"</span><i class='iconfont icon-close'></i></li>"
                var newIframe = "<iframe src='"+url+"' scrolling='yes' frameborder='0'></iframe>"
                $tabList.find("li").removeClass("active");
                $tabList.append(newTab);
                $iframeList.find("iframe").hide();
                $iframeList.append(newIframe);
            }
            this.delegate("a","click",function(ev){
                var $this = $(this)
                var href = $this.data("href")
                if(href){
                    var name = $this.text()
                    _this.openNewPage(name,href)
                }
            })
            //页面点击切换
            $tabList.delegate("li","click",function(ev){
                var $this = $(this)
                var index = $this.index()
                $this.addClass("active").siblings().removeClass("active")
                $iframeList.find("iframe").hide().eq(index).show()
            })
            //删除已打开的页面
            $tabList.delegate("i","click",function(){
                var $this = $(this)
                var $tab = $this.parent();
                var index = $tab.index();
                deleteTab(index)
            })

            // 右侧删除菜单
            $(".tab-operate").delegate("dd","click",function(ev){
                var $this = $(this)
                var operateIndex = $this.index()
                if(operateIndex === 0){//删除当前页面
                    var $curTab = $tabList.find("li.active");
                    if($curTab.hasClass("home")) return false;
                    var index = $curTab.index();
                    deleteTab(index)
                }else if(operateIndex === 1){//删除其他页面
                    var $curTab = $tabList.find("li.active");
                    var index = $curTab.index();
                    var $curIframe = $iframeList.find("iframe").eq(index);
                    $curTab.siblings(":not(.home)").remove()
                    $curIframe.siblings(":not(:first)").remove()
                }else if(operateIndex === 2){//删除所有
                    $tabList.find("li").eq(0).addClass("active").siblings().remove()
                    $iframeList.find("iframe").eq(0).show().siblings().remove()
                }
            })
            // 左右移动tab
            $(".tab-prev").click(function(){

            })
            $(".tab-next").click(function(){

            })

            // 菜单栏收缩
            $("#navViewChange").click(function(){
                $("body").toggleClass("nav-push")
                $(".layui-nav-item").removeClass("layui-nav-itemed")
            })
            $(".layui-nav-item").click(function(){
                $("body").removeClass("nav-push")
            })

            function isAllowOpenNewPage(name){
                var $navList = $("#navTabList");
                var navlistWidth = $navList.width();
                var navWidth = 0
                var isAllowed = true
                $navList.find("li").each(function(){
                    navWidth+=$(this).outerWidth()
                })
                navWidth += (name.length*14+48)
                if(navWidth>navlistWidth){
                    isAllowed = false
                }
                return isAllowed
            }

            //删除tab
            function deleteTab(index){
                var $tabs = $tabList.find("li")
                var $iframes = $iframeList.find("iframe")
                var $curTab = $tabs.eq(index)
                var $prevTab = $tabs.eq(index-1)
                var $curIframe =  $iframes.eq(index)
                var $prevIframe =  $iframes.eq(index-1)
                $curTab.remove()
                $curIframe.remove()
                if($curTab.hasClass("active")){
                    $prevTab.addClass("active")
                    $prevIframe.show()
                }
            }

            //根据数据获取菜单树dom结构
            function getListDom(data){
                var str = ""
                $.each(data,function(index,value){
                    str += "<li class='layui-nav-item'>"
                    
                    str += getChildDom(value)
                    
                    str += "</li>"
                })
                return str
            }
            function getChildDom(data){
                var str = "<a href='javascript:void(0);' data-href='"+data.href+"'>"+(data.menuClass?"<i class='iconfont icon-"+(data.menuClass||"nav_defalt")+" nav-icon'></i>":"")+"<span>"+data.name+"</span></a>"
                if(data.children&&data.children.length){
                    str += "<dl class='layui-nav-child'>"
                    $.each(data.children,function(index,value){
                        str += "<dd>"
                        if(value.children&&value.children.length){
                            str += getChildDom(value)
                        }else{
                            str += "<a href='javascript:void(0);' data-href='"+value.href+"'>"+value.name+"</a>"
                        }
                        str += "</dd>"
                    })
                    str += "</dl>"
                }
                return str
            }
            return this
        }
    })
})(jQuery)