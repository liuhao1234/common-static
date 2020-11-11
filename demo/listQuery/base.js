layui.use(["layer","form","laydate","table"],function(){
    lyform = layui.form
    lydate = layui.laydate
    lytable = layui.table
    layer = layui.layer
    console.log(new Date())
    var dateObj = new Date()
    lydate.render({
        elem: '#dateStart',
        value: new Date(dateObj.getTime()+1000*60*60*24)
    });
    lydate.render({
        elem: '#dateEnd',
        value: new Date(dateObj.getTime()+1000*60*60*24*30)
    });
    $("#reset").click(function(){
        lyform.val("form",{
            name:"",
            status:"aaa",
            dateStart:new Date(dateObj.getTime()+1000*60*60*24),
            dateEnd:new Date(dateObj.getTime()+1000*60*60*24*30),
            dateCur:"",
            searchType:2
        })
    })
    var curDate = lydate.render({
        elem: '#dateCur',
        type:'month',
        // format:'yyyy-MM',
        // value: '2017-09',
        // isInitValue: false,
        // showBottom:false,
        change:function(value, date, endDate){
            console.log(value)
        },
        done: function(value, date, endDate){
            console.log(value)
        }
    });
    lytable.render({
        elem: '#searchResult',
        cols: [[ //标题栏
                {field: 'id', title: 'ID',rowspan:2}
                ,{field: 'username', title: '用户名'}
                ,{field: 'email', title: '邮箱'}
                ,{field: 'sign', title: '签名'}
                ,{field: 'sex', title: '性别',rowspan:2}
                ,{field: 'city', title: '城市',rowspan:2}
                ,{field: 'experience', title: '积分',rowspan:2}
                ,{
                    field: '', 
                    title: '操作',
                    rowspan:2,
                    templet:function(d){
                        // console.log(d)
                        return "<a class='layui-btn layui-btn-normal layui-btn-xs' onclick=settingPopUpWindow("+JSON.stringify(d)+") href='javascript:void(0)'>配置</a> <a class='layui-btn layui-btn-warm layui-btn-xs' onclick=listViewPopUpWindow("+JSON.stringify(d)+") href='javascript:void(0)'>审核</a>"
                    }
                }
            ]],
        data:searchData,
        even: true,
        page:true,
        limit:10,
        totalRow:true
    })
    $("#searchSubmit").click();
    lyform.on('submit(formDemo)', function(data){
        console.log(data)
        layer.msg(JSON.stringify(data.field));
        return false;
    });
    //自定义验证规则
    lyform.verify({
        name: function(value){
            if(value.length < 5){
                return '清单名称至少得5个字符';
            }
        }
    });
    // layer.load(2); 
    // layer.msg("aaa")
    // layer.alert("aaa",{
    //     title:"aaa",
    //     icon: 6
    // })
    // layer.confirm('纳尼?',{
    //     btnAlign:'c'//第二个对象是配置，不需要配置时可删除
    // },function(){
    //     console.log(111)
    // },function(){
    //     console.log(222)
    // })

    
})
// 清单数据预览弹窗
function listViewPopUpWindow(params){
    console.log(params)
    layer.open({
        type: 1,
        btn:["通过","不通过"],
        btnAlign:"c",
        title:"清单数据预览",
        area:["800px","400px"],
        resize:false,
        content:'<div class="pUpWin-body">'+
                    '<table class="layui-hide" id="listPreview"></table>'+
                '</div>',
        success: function(layero, index){
            lytable.render({
                elem: '#listPreview',
                cols: [[ //标题栏
                        {field: 'id', title: 'ID'},
                        {field: 'username', title: '用户名'}
                    ]],
                data:searchData,
                even: true,
                page:false,
                limit:Number.MAX_VALUE,
                height:280,
                totalRow:false
            })
        },
        yes:function(index, layero){
            
            layer.close(index);//关闭弹窗
        }
    });
}

// 清单人员配置弹窗
function settingPopUpWindow(params){
    console.log(params)
    layer.open({
        type: 1,
        btn:["确定","取消"],
        btnAlign:"c",
        title:"清单人员配置",
        area:["800px","400px"],
        resize:false,
        content:'<div class="pUpWin-body layui-clear">'+
                    '<div class="left">'+
                        '<h4>分配员工</h4>'+
                        '<table class="layui-hide" id="staffSetting"></table>'+
                    '</div>'+
                    '<div class="right">'+
                        '<h4>员工列表</h4>'+
                        '<input type="text" autocomplete="off" placeholder="请输入关键字" class="layui-input" style="margin:10px 0;">'+
                        '<div class="staff-list">'+
                            '<ul class="ztree staff-tree" id="staffTree">'+

                            '</ul>'+
                        '</div>'+
                    '</div>'+
                '</div>',
        success: function(layero, index){
            lytable.render({
                elem: '#staffSetting',
                cols: [[ //标题栏
                        {field: 'id', title: 'ID'},
                        {field: '', title: '用户名'}
                    ]],
                data:searchData,
                even: true,
                page:false,
                
                limit:Number.MAX_VALUE,
                height:258,
                totalRow:false
            })
            // ztree渲染
            var zTreeObj
            var setting = {
                edit: {
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false,
                    drag: {
                        prev: false,
                        next: false,
                        inner: false
                    }
                },
                data: {
                    keep: {
                        parent: true,
                        leaf: true
                    },
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onDrop: ztreeNodesOnDrop
                }
            }
            zTreeObj = $.fn.zTree.init($("#staffTree"), setting, ztreeData);
            labelRemove()
        },
        yes:function(index, layero){
            
            layer.close(index);//关闭弹窗
        }
    });
}

function ztreeNodesOnDrop(e, treeId, treeNodes){
    console.log(e)
    // console.log(treeId)
    console.log(treeNodes)
    var $target = $(e.target)
    if($target.parent().index()==1&&$target.hasClass("layui-table-cell")&&treeNodes[0].level===1){
        $target.append(" <span class='layui-badge layui-bg-blue layui-label'><b>"+treeNodes[0].name+"</b><i class='iconfont icon-close label-remove'></i></span> ")
    }
}

// ztree拖动生成的label自我删除
function labelRemove(){
    $("[lay-id=staffSetting]").delegate(".label-remove","click",function(){
        $(this).parent().remove()
    })
}