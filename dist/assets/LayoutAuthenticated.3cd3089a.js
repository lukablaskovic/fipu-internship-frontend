import{x as r,y as w,F as u,J as j,z as e,T as W,I as A,C as f,r as P,u as t,f as b,w as he,G as h,K as z,A as R,Y as ne,H as K,M as se,_ as ye,q as ue,v as xe,B as re,Q as F,U as _e,a0 as ze,P as i}from"./vue.20f6a325.js";import{$ as we,a as ce,n as de,a0 as me,u as q,a1 as Ce,a2 as Me,a3 as Se,a4 as Le,a5 as $e,a6 as Ae,H as ve,l as pe,d as Y,C as E,a7 as X,g as ee,f as ae,a8 as te,a9 as Pe,aa as Be,ab as Ne,_ as ie,i as le,j as De,k as Ue,c as Ie,ac as Ve}from"./BaseButton.2cef5f39.js";import{j as He,n as Ee,o as V,e as Te,d as x,a as Oe,R as ke,c as Z,f as $,m as k,i as Fe,b as Re,l as L}from"./index.4853f032.js";import{F as Ke,c as _,b as qe,_ as Ze,a as Ge}from"./SnackBar.e02f2538.js";import{_ as Je}from"./BaseButtons.44748d19.js";import{_ as Qe}from"./CardBox.65ca0edd.js";const We=[{to:"/dashboard",icon:we,label:"Nadzorna plo\u010Da"},{to:"/studenti",icon:ce,label:"Studenti",updateMark:"danger"},{to:"/alokacije",icon:de,label:"Alokacije"},{to:"/dostupni-zadaci",icon:me,label:"Zadaci"},{to:"/poslodavci",icon:q,label:"Poslodavci"},{label:"Admin",icon:Ce,menu:[{to:"/bpmn/microservices",label:"Mikroservisi"},{label:"PDF Generator",externalURL:"https://html-to-pdf-maker.netlify.app/"},{to:"/poslodavci/novi-zadatak",label:"Forma za prijavu zadatka"}]}],fe={__name:"OverlayLayer",props:{zIndex:{type:String,default:"z-50"},type:{type:String,default:"flex"}},emits:["overlay-click"],setup(a,{emit:c}){const l=o=>{c("overlay-click",o)};return(o,s)=>(r(),w("div",{class:f([[a.type,a.zIndex,a.type=="pointer-events-none"?"opacity-0":"opacity-100"],"items-center flex justify-center overflow-hidden fixed inset-0 transition-opacity duration-300 ease-in-out"])},[u(W,{"enter-active-class":"transition duration-150 ease-in","enter-from-class":"opacity-0","enter-to-class":"opacity-100","leave-active-class":"transition duration-150 ease-in","leave-from-class":"opacity-100","leave-to-class":"opacity-0"},{default:j(()=>[e("div",{class:"absolute inset-0 bg-gradient-to-tr opacity-90 from-gray-700 via-gray-800 to-gray-900 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900",onClick:l})]),_:1}),u(W,{class:"relative","enter-active-class":"transition duration-100 ease-out","enter-from-class":"transform scale-95 opacity-0","enter-to-class":"transform scale-100 opacity-100","leave-active-class":"animate-fade-out"},{default:j(()=>[A(o.$slots,"default")]),_:3})],2))}},Ye={__name:"UpdateMark",props:{color:{type:String,required:!0,validator:a=>["info","danger","success","warning"].includes(a)},position:{type:String,default:"top-0 right-0"}},setup(a){const c=P(!0);return setTimeout(()=>{c.value=!1},3e3),(l,o)=>(r(),w("div",{class:f(["w-2 h-2 rounded-full absolute transition-all duration-300",[a.position,t(He)[a.color],{"animate-ping":c.value}]])},null,2))}},ge={__name:"AsideMenuItem",props:{item:{type:Object,required:!0},activeSecondaryMenuKey:{type:String,default:null},isDropdownList:Boolean,isCompact:Boolean},emits:["menu-click"],setup(a,{emit:c}){const l=a,o=Ee(),s=V(),d=b(()=>S.value?"":`${o.asideMenuItemInactiveStyle} dark:text-gray-300`),m=b(()=>`${o.asideMenuItemActiveBgStyle} dark:bg-slate-700/25`),v=b(()=>S.value?"":o.asideMenuItemActiveStyle),M=b(()=>l.isCompact);he(M,C=>{C&&(n.value=!1)});const n=P(!1),p=b(()=>{var C,U;return l.activeSecondaryMenuKey&&((C=l.item)==null?void 0:C.key)&&((U=l.item)==null?void 0:U.key)===l.activeSecondaryMenuKey}),S=b(()=>l.item&&l.item.color),y=b(()=>{const C=[l.isDropdownList?"py-3 px-6 text-sm":"py-3",S.value?Te(l.item.color,!1,!0):`${o.asideMenuItemStyle} dark:hover:bg-gray-700/50`];return!S.value&&(n.value||p.value)&&C.push(m.value),C}),g=b(()=>!!l.item.menu),D=b(()=>!!l.item.menuSecondary),B=b(()=>g.value||D.value),I=b(()=>D.value?Me:n.value?Se:Le),T=C=>{if(c("menu-click",C,l.item),s.tooltip.content="",l.item.externalURL){window.open(l.item.externalURL,"_blank");return}g.value&&(n.value=!n.value)};return(C,U)=>{var G,J,Q;return r(),w("li",null,[(r(),h(ne(a.item.to?t(ke):"a"),{onMouseover:U[0]||(U[0]=N=>a.isCompact?t(s).tooltip={content:a.item.label,offsetx:16,offsety:-8,justify:""}:""),onMouseleave:U[1]||(U[1]=N=>t(s).tooltip={content:"",offsetx:0,offsety:0}),onClick:T,to:(G=a.item.to)!=null?G:null,href:(J=a.item.href)!=null?J:null,target:(Q=a.item.target)!=null?Q:null,"exact-active-class":a.activeSecondaryMenuKey?null:m.value,class:f(["flex cursor-pointer transition-all duration-150",[y.value,a.isCompact?"justify-center":"justify-start",a.item.color=="info"?"hover:bg-fipu_dark_blue":"hover:bg-gray-900/75"]])},{default:j(N=>[a.item.icon?(r(),h(x,{key:0,path:a.item.icon,class:f(["flex-none transition-all duration-300",[N&&N.isExactActive?v.value:d.value,{relative:a.item.updateMark},a.item.color=="info"?"text-slate-800":""]]),w:a.isCompact?"w-8 lg:w-16":"w-8",size:a.item.size?a.item.size:18},{default:j(()=>[a.item.updateMark&&t(Oe).dashboard_data.waiting_for_allocation>0?(r(),h(Ye,{key:0,color:a.item.updateMark,position:a.isCompact?"top-0 left-5 md:left-9":"top-0 left-5"},null,8,["color","position"])):z("",!0)]),_:2},1032,["path","w","size","class"])):z("",!0),e("span",{class:f(["transition-all duration-300 text-clip line-clamp-1",[{"":a.isCompact,"":!B.value},N&&N.isExactActive?v.value:d.value,a.isCompact?a.item.menu==null?"w-52 lg:w-0":"w-40 lg:w-0":"w-40",a.item.color=="info"?"text-slate-900 font-medium hover:underline":""]])},R(a.item.label),3),B.value?(r(),h(x,{key:1,path:I.value,class:f(["flex-none animate-fade-in-fast",[{"lg:hidden":a.isCompact},N&&N.isExactActive?v.value:d.value]]),w:"w-12"},null,8,["path","class"])):z("",!0)]),_:1},40,["to","href","target","exact-active-class","class"])),g.value?(r(),h(be,{key:0,menu:a.item.menu,"is-dropdown-list":"",class:f([t(o).asideMenuDropdownStyle,n.value?"block dark:bg-slate-800/50":"hidden"])},null,8,["menu","class"])):z("",!0)])}}},be={__name:"AsideMenuList",props:{isDropdownList:Boolean,isCompact:Boolean,menu:{type:Array,default:()=>[]},activeSecondaryMenuKey:{type:String,default:null}},emits:["menu-click"],setup(a,{emit:c}){const l=(o,s)=>{c("menu-click",o,s)};return(o,s)=>(r(),w("ul",null,[(r(!0),w(K,null,se(a.menu,(d,m)=>(r(),h(ge,{key:m,item:d,"is-dropdown-list":a.isDropdownList,"is-compact":a.isCompact,"active-secondary-menu-key":a.activeSecondaryMenuKey,onMenuClick:l},null,8,["item","is-dropdown-list","is-compact","active-secondary-menu-key"]))),128))]))}},Xe={class:"flex-1 overflow-y-auto fipu_vertical_scrollbar overflow-x-hidden"},oe={__name:"AsideMenuLayer",props:{menu:{type:Array,default:()=>[]},activeSecondaryMenuKey:{type:String,default:null},zIndex:{type:String,default:"z-50"},isCompact:Boolean},emits:["menu-click"],setup(a,{emit:c}){const l=Z(),o=(s,d)=>{if(d.logoutModalActive){k.activateLogoutModal(!0);return}if(d.label=="Prijava"){l.push("/login");return}c("menu-click",s,d)};return(s,d)=>(r(),w("aside",{id:"aside",class:f([a.zIndex,"lg:py-2 lg:pl-2 flex fixed top-0 h-screen transition-position overflow-hidden"])},[e("div",{class:f([t($).asideStyle,"lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900"])},[e("div",{class:f([t($).asideBrandStyle,"flex flex-row w-full shrink-0 items-center dark:bg-slate-900"])},[A(s.$slots,"default")],2),e("div",Xe,[u(be,{menu:a.menu,"is-compact":a.isCompact,"active-secondary-menu-key":a.activeSecondaryMenuKey,onMenuClick:o},null,8,["menu","is-compact","active-secondary-menu-key"])]),A(s.$slots,"footer")],2)],2))}},ea={class:"flex flex-row items-center justify-center p-2 dark:bg-slate-900"},aa=["src"],ta={class:"hidden lg:block"},ia={class:"flex-1"},la={__name:"AsideMenu",props:{menu:{type:Array,required:!0}},emits:["menu-click"],setup(a,{emit:c}){const l=V(),o=P(!0),s=P(null),d=b(()=>s.value?"flex":o.value?"pointer-events-none":"hidden lg:flex"),m=()=>{s.value=null},v=(y,g)=>{c("menu-click",y,g),g.menu&&(o.value=!1),g.menuSecondary&&(s.value&&g.key===s.value.key?m():s.value=g)},M=(y,g)=>{c("menu-click",y,g)},n=()=>{s.value?m():o.value||(o.value=!0)};window.addEventListener("keydown",y=>{y.key==="Escape"&&(s.value||!o.value)&&n()}),Z().afterEach(()=>{o.value=!0});const S=b(()=>({label:o.value?"Pro\u0161iri":"Smanji",icon:o.value?$e:Ae,color:"info",size:24}));return(y,g)=>{var B;const D=ye("router-link");return r(),w(K,null,[u(oe,{menu:a.menu,class:f([t(l).isAsideMobileExpanded?"left-0":"-left-60 lg:left-0",(o.value,""),{"lg:hidden xl:flex":!t(l).isAsideLgActive}]),"is-compact":o.value,"z-index":s.value?"z-40 md:z-50":"z-50","active-secondary-menu-key":(B=s.value)==null?void 0:B.key,onMenuClick:v},{footer:j(()=>[e("ul",ta,[u(ge,{item:S.value,"is-compact":o.value,onMenuClick:g[0]||(g[0]=I=>o.value=!o.value)},null,8,["item","is-compact"])])]),default:j(()=>[u(D,{to:"/"},{default:j(()=>[e("div",ea,[e("img",{src:t(Ke),class:"max-h-14 object-contain"},null,8,aa)])]),_:1})]),_:1},8,["menu","class","is-compact","z-index","active-secondary-menu-key"]),s.value?(r(),h(oe,{key:0,menu:s.value.menuSecondary,onMenuClick:M,class:f([[o.value?"lg:left-22":"md:left-60"],"right-0 md:right-auto animate-fade-in-right-fast lg:animate-fade-in-left-fast"])},{default:j(()=>[s.value.icon?(r(),h(x,{key:0,path:s.value.icon,w:"w-16"},null,8,["path"])):z("",!0),e("div",ia,R(s.value.label),1),u(x,{path:t(ve),class:"cursor-pointer",w:"w-12",onClick:m},null,8,["path"])]),_:1},8,["menu","class"])):z("",!0),u(fe,{type:d.value,"z-index":"z-40",onOverlayClick:n},null,8,["type"])],64)}}},oa=[{to:"/moja-praksa",icon:pe,label:"Moja praksa"},{to:"/poslodavci",icon:q,label:"Poslodavci"}],na=[[{isCurrentUser:!0,menu:[{icon:Y,label:"Moj profil",to:"/profil"},{icon:E,label:"Poruke",to:"/poruke"}]},{icon:X,label:"Pomo\u0107",isDesktopNoLabel:!0,isHelp:!0,size:22},{icon:ee,label:"Prijavi bug",isDesktopNoLabel:!0,externalURL:"https://github.com/lukablaskovic/fipu-internship-frontend/issues",size:22},{icon:ae,label:"Promjena teme",isDesktopNoLabel:!0,isToggleLightDark:!0},{icon:te,label:"Odjava",isDesktopNoLabel:!0,isLogout:!0}],[{icon:Y,label:"Moj profil",to:"/profil"},{icon:E,label:"Poruke",to:"/poruke"},{icon:X,label:"Pomo\u0107",isDesktopNoLabel:!0,isHelp:!0,size:22},{icon:ee,label:"Prijavi bug",isDesktopNoLabel:!0,externalURL:"https://github.com/lukablaskovic/fipu-internship-frontend/issues",size:22},{icon:ae,label:"Promjena teme",isDesktopNoLabel:!0,isToggleLightDark:!0},{icon:te,label:"Odjava",isDesktopNoLabel:!0,isLogout:!0}]],sa=["src","alt"],ua={__name:"UserAvatar",props:{username:{type:String,default:null},avatar:{type:String,default:null}},setup(a){const c=a,l=b(()=>c.username);return(o,s)=>(r(),w("div",null,[e("img",{src:a.avatar,alt:l.value,class:"rounded-full block h-auto w-full max-w-full bg-gray-100 dark:bg-slate-800 aspect-square"},null,8,sa),A(o.$slots,"default")]))}},ra="/small_loading_gif.gif",ca={__name:"UserAvatarCurrentUser",setup(a){return(c,l)=>(r(),h(ua,{username:t(k).currentUser.username,avatar:t(k).avatarChanging?t(ra):t(k).currentUser.avatar},{default:j(()=>[A(c.$slots,"default")]),_:3},8,["username","avatar"]))}},da={__name:"NavBarItem",props:{item:{type:Object,required:!0}},emits:["menu-click"],setup(a,{emit:c}){const l=a,o=V(),s=b(()=>l.item.href?"a":l.item.to?ke:"div"),d=b(()=>{const y=[v.value?`${$.navBarItemLabelActiveColorStyle} dark:text-slate-400`:`${$.navBarItemLabelStyle} dark:text-white dark:hover:text-slate-400 ${$.navBarItemLabelHoverStyle}`,l.item.menu?"lg:py-2 lg:px-3":"py-2 px-3"];return l.item.isDesktopNoLabel&&y.push("lg:w-16","lg:justify-center"),y}),m=b(()=>l.item.isCurrentUser?k.currentUser.username||`${k.currentUser.ime} ${k.currentUser.prezime}`:l.item.label),v=P(!1),M=y=>{if(c("menu-click",y,l.item),o.tooltip.content="",l.item.externalURL){window.open(l.item.externalURL,"_blank");return}l.item.menu&&(v.value=!v.value)},n=(y,g)=>{c("menu-click",y,g)},p=P(null),S=y=>{p.value&&!p.value.contains(y.target)&&(v.value=!1)};return ue(()=>{l.item.menu&&window.addEventListener("click",S)}),xe(()=>{l.item.menu&&window.removeEventListener("click",S)}),(y,g)=>{var D,B,I;return a.item.isDivider?(r(),h(_,{key:0,"nav-bar":""})):(r(),h(ne(s.value),{key:1,ref_key:"root",ref:p,class:f(["block lg:flex items-center relative cursor-pointer",d.value]),to:(D=a.item.to)!=null?D:null,href:(B=a.item.href)!=null?B:null,target:(I=a.item.target)!=null?I:null,onClick:M},{default:j(()=>[e("div",{class:f(["flex items-center",{"bg-gray-100 dark:bg-slate-800 lg:bg-transparent lg:dark:bg-transparent p-3 lg:p-0":a.item.menu}])},[a.item.isCurrentUser?(r(),h(ca,{key:0,class:"w-6 h-6 mr-3 inline-flex"})):z("",!0),a.item.icon?(r(),h(x,{key:1,size:a.item.size?a.item.size:19,path:a.item.icon,class:"transition-colors text-fipu_gray hover:text-fipu_blue dark:text-white dark:hover:text-fipu_blue",onMouseover:g[0]||(g[0]=T=>a.item.isDesktopNoLabel?t(o).tooltip={content:m.value,offsetx:0,offsety:40,justify:"justify-center items-center"}:""),onMouseleave:g[1]||(g[1]=T=>t(o).tooltip={content:"",offsetx:0,offsety:0})},null,8,["size","path"])):z("",!0),e("span",{class:f(["px-2 transition-colors text-base",{"lg:hidden":a.item.isDesktopNoLabel&&a.item.icon}])},R(m.value),3),a.item.menu!=null?(r(),h(x,{key:2,path:v.value?t(Pe):t(Be),class:"hidden lg:inline-flex transition-colors"},null,8,["path"])):z("",!0)],2),a.item.menu?(r(),w("div",{key:0,style:re(v.value?"height: "+a.item.menu.length*42+"px;":"height: 0px;"),class:"text-sm lg:absolute lg:top-full lg:left-0 lg:min-w-full overflow-hidden lg:z-20 lg:rounded-lg lg:shadow-lg transition-size duration-300 bg-gray-100 dark:bg-slate-800"},[u(je,{"is-submenu":!0,menu:a.item.menu,onMenuClick:n},null,8,["menu"])],4)):z("",!0)]),_:1},8,["class","to","href","target"]))}}},je={__name:"NavBarMenuList",props:{menu:{type:Array,default:()=>[]},isSubmenu:{type:Boolean,default:!1}},emits:["menu-click"],setup(a,{emit:c}){const l=V(),o=(s,d)=>{c("menu-click",s,d)};return(s,d)=>(r(!0),w(K,null,se(a.isSubmenu?a.menu:a.menu[t(l).isLg?0:1],(m,v)=>(r(),h(da,{key:v,item:m,onMenuClick:o},null,8,["item"]))),128))}},H={__name:"NavBarItemPlain",props:{display:{type:String,default:"flex"},useMargin:Boolean},setup(a){return(c,l)=>(r(),w("div",{class:f([[a.display,t($).navBarItemLabelStyle,t($).navBarItemLabelHoverStyle,a.useMargin?"my-2 mx-3":"py-2 px-3"],"items-center cursor-pointer dark:text-white dark:hover:text-slate-400"])},[A(c.$slots,"default")],2))}},ma={class:"top-0 inset-x-0 fixed bg-gray-50 h-14 z-30 transition-position w-screen lg:w-auto dark:bg-slate-800"},va={class:"flex flex-1 items-stretch h-14"},pa={class:"flex-none items-stretch flex h-14 lg:hidden"},ka={__name:"NavBar",props:{menu:{type:Array,required:!0}},emits:["menu-click"],setup(a,{emit:c}){const l=V(),o=(d,m)=>{c("menu-click",d,m)},s=P(!1);return(d,m)=>(r(),w("nav",ma,[e("div",{class:f(["flex lg:items-stretch",t(Fe)])},[e("div",va,[A(d.$slots,"default")]),e("div",pa,[u(H,{onClick:m[0]||(m[0]=F(v=>s.value=!s.value,["prevent"]))},{default:j(()=>[u(x,{path:s.value?t(ve):t(Ne),size:"24"},null,8,["path"])]),_:1})]),e("div",{class:f(["max-h-screen-menu overflow-y-auto lg:overflow-visible fipu_vertical_scrollbar absolute w-screen top-14 -left-2 transition-size duration-300 bg-gray-50 shadow-lg lg:w-auto lg:flex lg:static lg:shadow-none dark:bg-slate-800",[s.value?"h-64 lg:h-auto":"h-0 lg:h-auto"]]),style:re(s.value&&!t(l).isLg?"height: "+a.menu[1].length*42+"px;":"")},[u(je,{menu:a.menu,onMenuClick:o},null,8,["menu"])],6)],2)]))}};const fa={__name:"CardBoxModal",props:{title:{type:String,required:!0},button:{type:String,default:"fipu_blue"},buttonLabel:{type:String,default:"Done"},hasCancel:Boolean,modelValue:{type:[String,Number,Boolean,Object],default:null},disabledCondition:{type:Boolean,default:!1},hasConfirm:{type:Boolean,default:!0},large:{type:Boolean,default:!1},isLogout:{type:Boolean,default:!1}},emits:["update:modelValue","cancel","confirm"],setup(a,{emit:c}){const l=a,o=b({get:()=>l.modelValue,set:v=>c("update:modelValue",v)}),s=v=>{o.value=!1,c(v)},d=()=>s("confirm"),m=()=>s("cancel");return window.addEventListener("keydown",v=>{v.key==="Escape"&&o.value&&m()}),(v,M)=>(r(),h(fe,{type:o.value?"":"pointer-events-none",class:"z-[5000]",onOverlayClick:m},{default:j(()=>[_e(u(Qe,{class:f({"rounded shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-2/5 xl:w-6/12 2xl:3/12 z-50 modal-scrollable fipu_vertical_scrollbar":!a.large&&!a.isLogout,"rounded shadow-lg max-h-modal w-full md:w-4/5 lg:w-3/5 xl:w-3/5 z-50 modal-scrollable fipu_vertical_scrollbar":a.large&&!a.isLogout,"rounded shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-1/5 xl:w-4/12 2xl:3/12 z-50 modal-scrollable fipu_vertical_scrollbar":a.isLogout}),"is-modal":""},{default:j(()=>[u(qe,{title:a.title},null,8,["title"]),a.modelValue!=null?A(v.$slots,"default",{key:0,assignment:a.modelValue},void 0,!0):z("",!0),u(Je,{class:"justify-center"},{default:j(()=>[a.hasConfirm?(r(),h(ie,{key:0,label:a.buttonLabel,color:a.button,disabled:a.disabledCondition,onClick:d},null,8,["label","color","disabled"])):z("",!0),a.hasCancel?(r(),h(ie,{key:1,label:"Natrag",color:a.button,outline:"",onClick:m},null,8,["color"])):z("",!0)]),_:1})]),_:3},8,["class"]),[[ze,o.value]])]),_:3},8,["type"]))}},O=Re(fa,[["__scopeId","data-v-5ca4cdd1"]]);const ga=e("div",{class:"text-xl mb-2"},"O kolegiju",-1),ba=e("div",null,[i("Cilj kolegija "),e("b",null,"Stru\u010Dna praksa"),i(" je omogu\u0107iti studentima prakti\u010Dni rad u IT poduze\u0107ima na projektima oblikovanja i implementacije programske podr\u0161ke; usvajanja stru\u010Dnih kompetencija iz podru\u010Dja djelovanja organizacije u kojoj se praksa provodi te razvijanje osje\u0107aja odgovornosti i timskoga rada unutar zadanoga radnoga okru\u017Eenja.")],-1),ja=e("div",{class:"text-xl mb-2"},"Prijava na praksu",-1),ha=e("ol",{class:"list-decimal ml-4"},[e("li",null,[i(" Studenti se prijavljuju na praksu putem aplikacije "),e("em",null,"FIPU Praksa"),i(" u kojem prvo odabiru 3 zadatka koja bi \u017Eeljeli raditi. ")]),e("li",null,"Nakon \u0161to vas se alocira na jedan od prijavljenih zadataka, morate kontaktirati mentora. Predstavite se i recite da ste dobili zadatak. Poslodavac mo\u017Ee zatra\u017Eiti intervju ili provesti selekciju."),e("li",null,"Profesor mo\u017Ee i odbiti zadatke koje ste odabrali te vas vratiti na po\u010Detni korak odabira preferencija, ili vas mo\u017Ee alocirati na neko 4. poduze\u0107e ukoliko smatra da je to potrebno.")],-1),ya=e("div",{class:"text-xl mb-2"},"Izvo\u0111enje prakse",-1),xa={class:"list-decimal ml-4"},_a=e("li",null,[i("Potrebno je s mentorom dogovoriti datum po\u010Dekta izvo\u0111enja prakse. Kada sve finalno dogovorite s mentorom popunite Prijavnicu putem aplikacije "),e("b",null,"prije po\u010Detka izvo\u0111enja prakse"),i(".")],-1),za={class:"flex flex-wrap text-base"},wa=e("li",null,[i("Nakon ispunjavanja prijavnice, na mail \u0107ete vi i mentor dobiti praznu Potvrdu. Mora ju ispuniti "),e("b",null,"mentor"),i(" i to po zavr\u0161etku odra\u0111enog posla.")],-1),Ca=e("li",null,"U\u017Eivajte u izvo\u0111enju prakse \u{1F642} Have fun i u\u010Dite! Nemojte zaboraviti svakodnevno voditi Dnevnik!",-1),Ma=e("div",{class:"text-xl mb-2"},"Zavr\u0161etak prakse i prijava ispita",-1),Sa=e("ol",{class:"list-decimal ml-4"},[e("li",null,"Nakon \u0161to zavr\u0161ite sa stru\u010Dnom praksu potrebno je predati Dnevnik, tako\u0111er putem aplikacije."),e("li",null,[i(" Za kraj, potrebno je prijaviti ispit preko Studomata. Na ispit "),e("b",null,"ne morate"),i(" dolaziti, samo ga prijavite. ")])],-1),La=e("div",{class:"text-xl mb-2"},[i("Aplikacija "),e("em",null,"FIPU praksa")],-1),$a={class:"list-decimal ml-4"},Aa=e("li",null,[i(" Sve radnje (uklju\u010Duju\u0107i komunikaciju) vezane uz praksu obavljaju se isklju\u010Divo putem aplikacije "),e("em",null,"FIPU praksa"),i(". ")],-1),Pa={class:"flex flex-wrap text-base"},Ba=e("li",null,"Putem iste poveznice predajete dnevnik prakse, dok prijavnicu dobivate na va\u0161 email.",-1),Na={class:"flex flex-wrap text-base"},Da=e("p",null,[e("b",null,"Va\u017Eno!"),i(" Aplikacija "),e("em",null,"FIPU Praksa"),i(" razvijena je 2023. godine u sklopu istra\u017Eiva\u010Dkog laboratorija FIPU-lab za potrebe pojednostavljenja i automatizacije procesa izvo\u0111enja studentske prakse, za studente, voditelja te poslodavce.")],-1),Ua=e("p",{class:"mt-2"},"Aplikacija je razvijena eksperimentalnim BPMN model-based development-om i integracijom mikroservisa te je, kao i svaki drugi programski proizvod, podlo\u017Ena bugovima\u{1F41E}!",-1),Ia=e("p",{class:"mt-2"},[i("Stoga vas molimo da sve bugove koje prona\u0111ete prijavite otvaranjem novog Github issue-a, "),e("a",{class:"hover-underline-animation cursor-pointer text-fipu_text_blue",target:"_blank",href:"https://github.com/lukablaskovic/fipu-internship-frontend/issues"},"ovdje!")],-1),Va=e("p",{class:"mt-2"},"Hvala! \u{1F642}",-1),Ha=e("div",{class:"text-xl mb-2"},"O kolegiju",-1),Ea=e("div",null,[i("Cilj kolegija "),e("b",null,"Stru\u010Dna praksa"),i(" je omogu\u0107iti studentima prakti\u010Dni rad u IT poduze\u0107ima na projektima oblikovanja i implementacije programske podr\u0161ke; usvajanja stru\u010Dnih kompetencija iz podru\u010Dja djelovanja organizacije u kojoj se praksa provodi te razvijanje osje\u0107aja odgovornosti i timskoga rada unutar zadanoga radnoga okru\u017Eenja.")],-1),Ta=e("div",{class:"text-xl mb-2"},"Prijava na praksu",-1),Oa={class:"list-decimal ml-4"},Fa=e("li",null,[i(" Studenti se prijavljuju na praksu putem aplikacije "),e("em",null,"FIPU Praksa"),i(" u kojem prvo odabiru 3 zadatka koja bi \u017Eeljeli raditi. ")],-1),Ra={class:"flex flex-wrap text-base"},Ka=e("li",null,'Nakon odabira studenta, odaberite "Alociranje studenta na zadatak" na BPMN grafu. Nakon toga odaberite zadatak i potvrdite.',-1),qa=e("li",null,"Mo\u017Eete i odbiti preferencije nakon \u010Dega se studenta vra\u0107a na po\u010Detni korak.",-1),Za=e("div",{class:"text-xl mb-2"},"Dashboard",-1),Ga=e("ol",{class:"list-decimal ml-4"},[e("li",null,[i("Dashboard se trenutno sastoji od 2 dijela - "),e("b",null,"Nadzorna plo\u010Da"),i(", gdje mo\u017Eete vidjeti op\u0107enite numeri\u010Dke podatke o izvo\u0111enju prakse, te "),e("b",null,"Najnoviji doga\u0111aji"),i(", gdje se nalaze event logovi iz BPMN engine-a")]),e("li",null,"Mo\u017Eete stisnuti na pojedini event log, \u0161to \u0107e vas odnijeti na studenti/:id gdje je id jednak instanci tog procesa prakse za tog studenta"),e("li",null,[i("Tra\u017Eilicu mo\u017Eete otvoriti pritiskom "),e("b",null,"CTRL + k"),i(". Obi\u010Dnim upisivanjem mo\u017Eete brzo prelaziti kroz stranice aplikacije, a prefiksima (ispisani su u uputama tra\u017Eilice) mogu se tra\u017Eiti odre\u0111ene stavke, poput studenata po JMBAGU, emailu, ili poduze\u0107a.")])],-1),Ja=e("div",{class:"text-xl mb-2"},"Alokacije",-1),Qa={class:"list-decimal ml-4"},Wa={class:"flex flex-wrap text-base"},Ya=e("li",null,[i("Postoji nekoliko stanja alokacija: "),e("em",null,"student_prihva\u0107en"),i(", "),e("em",null,"student_odbijen"),i(", "),e("em",null,"evaluacija_u_tijeku"),i(", "),e("em",null,"student_odustao"),i(", "),e("em",null,"profesor_ponistio"),i(".")],-1),Xa=e("li",null,[i("U alokaciji se za sada prikazuju samo"),e("em",null,"student_prihva\u0107en"),i(", "),e("em",null,"evaluacija_u_tijeku"),i(),e("em",null,"te student_odbijen"),i(".")],-1),et=e("li",null,"Mo\u017Eete za svakog studenta pregledati dnevnik prakse te poslanu prijavnicu.",-1),at=e("div",{class:"text-xl mb-2"},"Poslodavci",-1),tt={class:"list-decimal ml-4"},it={class:"flex flex-wrap text-base"},lt=e("li",null,[i("Poslodavci su podijeljeni u 2 tablice: "),e("b",null,"Novi Poslodavci"),i(" i "),e("b",null,"Svi Poslodavci"),i(". Tablica Novi Poslodavci \u0107e prikazivati nove retke nakon \u0161to novo poduze\u0107e (koje jo\u0161 nije partner) prijavi zadatak.")],-1),ot=e("li",null,"Tada je potrebno ru\u010Dno unijeti podatke o poduze\u0107u",-1),nt=e("li",null,"Stvari je mogu\u0107e a\u017Eurirati i direktno kroz bazu podataka Baserow.",-1),st=e("div",{class:"text-xl mb-2"},"Dostupni Zadaci",-1),ut={class:"list-decimal ml-4"},rt={class:"flex flex-wrap text-base"},ct=e("li",null,[i("Tu mo\u017Eete vidjeti podjelu na "),e("b",null,"Novi Zadaci"),i(", "),e("b",null,"Aktivni Zadaci"),i(" te "),e("b",null,"Odbijeni Zadaci"),i(".")],-1),dt=e("li",null,"Zadatak novog partnera je mogu\u0107e odobriti i prije a\u017Euriranja podataka novog poduze\u0107a.",-1),mt=e("li",null,"Na ovoj stranici tako\u0111er mo\u017Eete prona\u0107i javni link koji se proslije\u0111uje poslodavcima za prijavu novog zadatka.",-1),vt=e("p",null,[e("b",null,"Va\u017Eno!"),i(" Aplikacija "),e("em",null,"Fipu Praksa"),i(" razvijena je 2023. godine u sklopu istra\u017Eiva\u010Dkog laboratorija FIPU-lab za potrebe pojednostavljenja i automatizacije procesa izvo\u0111enja studentske prakse, za studente, voditelja te poslodavce.")],-1),pt=e("p",{class:"mt-2"},"Aplikacija je razvijena eksperimentalnim BPMN model-based development-om i integracijom mikroservisa te je, kao i svaki drugi programski proizvod, podlo\u017Ena bugovima\u{1F41E}!",-1),kt=e("p",{class:"mt-2"},[i("Stoga vas molimo da sve bugove koje prona\u0111ete prijavite otvaranjem novog Github issue-a, "),e("a",{class:"hover-underline-animation cursor-pointer text-fipu_text_blue",target:"_blank",href:"https://github.com/lukablaskovic/fipu-internship-frontend/issues"},"ovdje!")],-1),ft=e("p",{class:"mt-2"},"Hvala! \u{1F642}",-1),gt={class:"grow relative"},bt={class:"mt-6"},jt=e("br",null,null,-1),ht=e("span",{style:{color:"#e25555"}},"\u2665",-1),Mt={__name:"LayoutAuthenticated",setup(a){const c=b(()=>L.isAsideLgActive?"lg:pl-22":"xl:pl-22"),l=Z(),o=b(()=>k.logoutModalActive),s=b(()=>k.helpModalActive),d=P(!1);let m=P([]);ue(()=>{d.value=k.userAdmin,d.value&&(m.value=We),d.value||(m.value=oa)}),l.beforeEach(()=>{L.isAsideMobileExpanded=!1});const v=(M,n)=>{n.isToggleLightDark&&$.setDarkMode(),n.isLogout&&k.activateLogoutModal(!0),n.isHelp&&k.activateHelpModal(!0)};return(M,n)=>(r(),w("div",{class:f({dark:t($).darkMode,"overflow-hidden lg:overflow-visible":t(L).isAsideMobileExpanded})},[e("div",{class:f([[c.value,{"ml-60 lg:ml-0":t(L).isAsideMobileExpanded}],"pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100 flex flex-col"])},[u(ka,{menu:t(na),class:f([c.value,{"ml-60 lg:ml-0":t(L).isAsideMobileExpanded}]),onMenuClick:v},{default:j(()=>[u(H,{display:"flex lg:hidden",onClick:n[0]||(n[0]=F(p=>t(L).asideMobileToggle(),["prevent"]))},{default:j(()=>[u(x,{path:t(L).isAsideMobileExpanded?t(le):t(De),size:"24"},null,8,["path"])]),_:1}),u(H,{display:"hidden lg:flex xl:hidden",onClick:n[1]||(n[1]=F(p=>t(L).asideLgToggle(),["prevent"]))},{default:j(()=>[u(x,{path:t(L).isAsideLgActive?t(le):t(Ue),size:"24"},null,8,["path"])]),_:1}),u(H,{"use-margin":""},{default:j(()=>[u(Ie,{icon:t(Ve),"search-bar":"",borderless:""},null,8,["icon"])]),_:1})]),_:1},8,["menu","class"]),u(O,{modelValue:o.value,"onUpdate:modelValue":n[2]||(n[2]=p=>o.value=p),"has-cancel":"","is-logout":"",title:"Jeste li sigurni da se \u017Eelite odjaviti?","button-label":"Odjava",class:"z-100",onCancel:n[3]||(n[3]=p=>t(k).activateLogoutModal(!1)),onConfirm:n[4]||(n[4]=p=>t(k).logout())},null,8,["modelValue"]),t(k).userAdmin?(r(),h(O,{key:1,modelValue:s.value,"onUpdate:modelValue":n[14]||(n[14]=p=>s.value=p),"has-cancel":"","has-confirm":!1,title:"\u2139\uFE0F Upute za kori\u0161tenje aplikacije","button-label":"Povratak",onCancel:n[15]||(n[15]=p=>t(k).activateHelpModal(!1))},{default:j(()=>[u(_),Ha,Ea,u(_),Ta,e("ol",Oa,[Fa,e("li",null,[e("div",Ra,[i(" Studente mo\u017Eete alocirati putem "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:n[10]||(n[10]=p=>t(l).push("/studenti")&&t(k).activateHelpModal(!1))},[u(x,{path:t(ce),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Studenti ")]),i(". ")])]),Ka,qa]),u(_),Za,Ga,u(_),Ja,e("ol",Qa,[e("li",null,[e("div",Wa,[i(" Alokacije mo\u017Eete provjeriti u "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:n[11]||(n[11]=p=>t(l).push("/alokacije")&&t(k).activateHelpModal(!1))},[u(x,{path:t(de),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Alokacije ")]),i(". ")])]),Ya,Xa,et]),u(_),at,e("ol",tt,[e("li",null,[e("div",it,[i(" Sve prijavljene poslodavce mo\u017Eete prona\u0107i u "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:n[12]||(n[12]=p=>t(l).push("/poslodavci")&&t(k).activateHelpModal(!1))},[u(x,{path:t(q),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Poslodavci ")]),i(". ")])]),lt,ot,nt]),u(_),st,e("ol",ut,[e("li",null,[e("div",rt,[i(" Novo-prijavljene zadatke mo\u017Eete prona\u0107i u "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:n[13]||(n[13]=p=>t(l).push("/dostupni-zadaci")&&t(k).activateHelpModal(!1))},[u(x,{path:t(me),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Dostupni zadaci ")]),i(". ")])]),ct,dt,mt]),u(_),vt,pt,kt,ft]),_:1},8,["modelValue"])):(r(),h(O,{key:0,modelValue:s.value,"onUpdate:modelValue":n[8]||(n[8]=p=>s.value=p),"has-cancel":"","has-confirm":!1,title:"\u2139\uFE0F Upute za kori\u0161tenje aplikacije","button-label":"Povratak",onCancel:n[9]||(n[9]=p=>t(k).activateHelpModal(!1))},{default:j(()=>[u(_),ga,ba,u(_),ja,ha,u(_),ya,e("ol",xa,[_a,e("li",null,[e("div",za,[i(" Niste dobili email? Javite se profesoru putem "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:n[5]||(n[5]=p=>t(l).push("/poruke")&&t(k).activateHelpModal(!1))},[u(x,{path:t(E),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Poruke ")]),i(". ")])]),wa,Ca]),u(_),Ma,Sa,u(_),La,e("ol",$a,[Aa,e("li",null,[e("div",Pa,[i(" Ovisno o stanju va\u0161e prakse, "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:n[6]||(n[6]=p=>t(l).push("/moja-praksa")&&t(k).activateHelpModal(!1))},[u(x,{path:t(pe),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Moja praksa ")]),i(" \xA0se a\u017Eurira automatski. ")])]),Ba,e("li",null,[e("div",Na,[i(" Komunikaciju s profesorom vr\u0161ite putem "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:n[7]||(n[7]=p=>t(l).push("/poruke")&&t(k).activateHelpModal(!1))},[u(x,{path:t(E),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Poruke ")]),i(". ")])])]),u(_),Da,Ua,Ia,Va]),_:1},8,["modelValue"])),u(la,{menu:t(m),onMenuClick:v},null,8,["menu"]),e("div",gt,[A(M.$slots,"default")]),e("div",bt,[u(Ze,null,{default:j(()=>[jt,i(" Made with "),ht,i(" at FIPU.lab")]),_:1})]),u(Ge)],2)],2))}};export{O as C,ua as _,Mt as a,H as b,ka as c,la as d,ca as e};
