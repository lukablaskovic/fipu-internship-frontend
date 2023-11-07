import{x as c,y as M,F as n,J as h,z as e,T as W,I as $,C as g,r as P,u as t,f as j,w as ye,G as y,K as w,A as K,Y as se,H as Z,M as ue,_ as xe,q as re,v as _e,B as ce,Q as R,U as ze,a0 as we,P as i}from"./vue.63142468.js";import{Y as Me,a as de,n as me,Z as ve,u as q,$ as Ce,a0 as Se,a1 as Le,a2 as Ae,a3 as $e,a4 as Pe,F as pe,l as fe,d as X,A as T,a5 as ee,g as ae,f as te,a6 as ie,a7 as Be,a8 as Ne,a9 as De,_ as le,i as oe,j as Ue,k as Ie,c as Ve,aa as He}from"./BaseButton.e0743500.js";import{j as Ee,n as Te,o as H,e as Fe,d as _,a as Oe,R as ke,c as G,f as A,m as k,i as Re,b as Ke,l as L}from"./index.ec626852.js";import{F as Ze,c as z,b as qe,_ as Ge,a as Je}from"./SnackBar.cf1f1554.js";import{_ as Ye}from"./BaseButtons.b1450643.js";import{_ as Qe}from"./CardBox.c2cf9add.js";const We=[{to:"/dashboard",icon:Me,label:"Nadzorna plo\u010Da"},{to:"/studenti",icon:de,label:"Studenti",updateMark:"danger"},{to:"/alokacije",icon:me,label:"Alokacije"},{to:"/dostupni-zadaci",icon:ve,label:"Zadaci"},{to:"/poslodavci",icon:q,label:"Poslodavci"},{label:"Admin",icon:Ce,menu:[{to:"/bpmn/microservices",label:"Mikroservisi"},{label:"PDF Generator",externalURL:"https://html-to-pdf-maker.netlify.app/"},{to:"/poslodavci/novi-zadatak",label:"Forma za prijavu zadatka"}]}],ge={__name:"OverlayLayer",props:{zIndex:{type:String,default:"z-50"},type:{type:String,default:"flex"}},emits:["overlay-click"],setup(a,{emit:m}){const l=m,r=o=>{l("overlay-click",o)};return(o,s)=>(c(),M("div",{class:g([[a.type,a.zIndex,a.type=="pointer-events-none"?"opacity-0":"opacity-100"],"items-center flex justify-center overflow-hidden fixed inset-0 transition-opacity duration-300 ease-in-out"])},[n(W,{"enter-active-class":"transition duration-150 ease-in","enter-from-class":"opacity-0","enter-to-class":"opacity-100","leave-active-class":"transition duration-150 ease-in","leave-from-class":"opacity-100","leave-to-class":"opacity-0"},{default:h(()=>[e("div",{class:"absolute inset-0 bg-gradient-to-tr opacity-90 from-gray-700 via-gray-800 to-gray-900 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900",onClick:r})]),_:1}),n(W,{class:"relative","enter-active-class":"transition duration-100 ease-out","enter-from-class":"transform scale-95 opacity-0","enter-to-class":"transform scale-100 opacity-100","leave-active-class":"animate-fade-out"},{default:h(()=>[$(o.$slots,"default")]),_:3})],2))}},Xe={__name:"UpdateMark",props:{color:{type:String,required:!0,validator:a=>["info","danger","success","warning"].includes(a)},position:{type:String,default:"top-0 right-0"}},setup(a){const m=P(!0);return setTimeout(()=>{m.value=!1},3e3),(l,r)=>(c(),M("div",{class:g(["w-2 h-2 rounded-full absolute transition-all duration-300",[a.position,t(Ee)[a.color],{"animate-ping":m.value}]])},null,2))}},be={__name:"AsideMenuItem",props:{item:{type:Object,required:!0},activeSecondaryMenuKey:{type:String,default:null},isDropdownList:Boolean,isCompact:Boolean},emits:["menu-click"],setup(a,{emit:m}){const l=a,r=m,o=Te(),s=H(),v=j(()=>S.value?"":`${o.asideMenuItemInactiveStyle} dark:text-gray-300`),f=j(()=>`${o.asideMenuItemActiveBgStyle} dark:bg-slate-700/25`),p=j(()=>S.value?"":o.asideMenuItemActiveStyle),u=j(()=>l.isCompact);ye(u,C=>{C&&(d.value=!1)});const d=P(!1),I=j(()=>{var C,U;return l.activeSecondaryMenuKey&&((C=l.item)==null?void 0:C.key)&&((U=l.item)==null?void 0:U.key)===l.activeSecondaryMenuKey}),S=j(()=>l.item&&l.item.color),x=j(()=>{const C=[l.isDropdownList?"py-3 px-6 text-sm":"py-3",S.value?Fe(l.item.color,!1,!0):`${o.asideMenuItemStyle} dark:hover:bg-gray-700/50`];return!S.value&&(d.value||I.value)&&C.push(f.value),C}),b=j(()=>!!l.item.menu),D=j(()=>!!l.item.menuSecondary),B=j(()=>b.value||D.value),V=j(()=>D.value?Se:d.value?Le:Ae),F=C=>{if(r("menu-click",C,l.item),s.tooltip.content="",l.item.externalURL){window.open(l.item.externalURL,"_blank");return}b.value&&(d.value=!d.value)};return(C,U)=>{var J,Y,Q;return c(),M("li",null,[(c(),y(se(a.item.to?t(ke):"a"),{onMouseover:U[0]||(U[0]=N=>a.isCompact?t(s).tooltip={content:a.item.label,offsetx:16,offsety:-8,justify:""}:""),onMouseleave:U[1]||(U[1]=N=>t(s).tooltip={content:"",offsetx:0,offsety:0}),onClick:F,to:(J=a.item.to)!=null?J:null,href:(Y=a.item.href)!=null?Y:null,target:(Q=a.item.target)!=null?Q:null,"exact-active-class":a.activeSecondaryMenuKey?null:f.value,class:g(["flex cursor-pointer transition-all duration-150",[x.value,a.isCompact?"justify-center":"justify-start",a.item.color=="info"?"hover:bg-fipu_dark_blue":"hover:bg-gray-900/75"]])},{default:h(N=>[a.item.icon?(c(),y(_,{key:0,path:a.item.icon,class:g(["flex-none transition-all duration-300",[N&&N.isExactActive?p.value:v.value,{relative:a.item.updateMark},a.item.color=="info"?"text-slate-800":""]]),w:a.isCompact?"w-8 lg:w-16":"w-8",size:a.item.size?a.item.size:18},{default:h(()=>[a.item.updateMark&&t(Oe).dashboard_data.waiting_for_allocation>0?(c(),y(Xe,{key:0,color:a.item.updateMark,position:a.isCompact?"top-0 left-5 md:left-9":"top-0 left-5"},null,8,["color","position"])):w("",!0)]),_:2},1032,["path","w","size","class"])):w("",!0),e("span",{class:g(["transition-all duration-300 text-clip line-clamp-1",[{"":a.isCompact,"":!B.value},N&&N.isExactActive?p.value:v.value,a.isCompact?a.item.menu==null?"w-52 lg:w-0":"w-40 lg:w-0":"w-40",a.item.color=="info"?"text-slate-900 font-medium hover:underline":""]])},K(a.item.label),3),B.value?(c(),y(_,{key:1,path:V.value,class:g(["flex-none animate-fade-in-fast",[{"lg:hidden":a.isCompact},N&&N.isExactActive?p.value:v.value]]),w:"w-12"},null,8,["path","class"])):w("",!0)]),_:1},40,["to","href","target","exact-active-class","class"])),b.value?(c(),y(je,{key:0,menu:a.item.menu,"is-dropdown-list":"",class:g([t(o).asideMenuDropdownStyle,d.value?"block dark:bg-slate-800/50":"hidden"])},null,8,["menu","class"])):w("",!0)])}}},je={__name:"AsideMenuList",props:{isDropdownList:Boolean,isCompact:Boolean,menu:{type:Array,default:()=>[]},activeSecondaryMenuKey:{type:String,default:null}},emits:["menu-click"],setup(a,{emit:m}){const l=m,r=(o,s)=>{l("menu-click",o,s)};return(o,s)=>(c(),M("ul",null,[(c(!0),M(Z,null,ue(a.menu,(v,f)=>(c(),y(be,{key:f,item:v,"is-dropdown-list":a.isDropdownList,"is-compact":a.isCompact,"active-secondary-menu-key":a.activeSecondaryMenuKey,onMenuClick:r},null,8,["item","is-dropdown-list","is-compact","active-secondary-menu-key"]))),128))]))}},ea={class:"flex-1 overflow-y-auto fipu_vertical_scrollbar overflow-x-hidden"},ne={__name:"AsideMenuLayer",props:{menu:{type:Array,default:()=>[]},activeSecondaryMenuKey:{type:String,default:null},zIndex:{type:String,default:"z-50"},isCompact:Boolean},emits:["menu-click"],setup(a,{emit:m}){const l=G(),r=m,o=(s,v)=>{if(v.logoutModalActive){k.activateLogoutModal(!0);return}if(v.label=="Prijava"){l.push("/login");return}r("menu-click",s,v)};return(s,v)=>(c(),M("aside",{id:"aside",class:g([a.zIndex,"lg:py-2 lg:pl-2 flex fixed top-0 h-screen transition-position overflow-hidden"])},[e("div",{class:g([t(A).asideStyle,"lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900"])},[e("div",{class:g([t(A).asideBrandStyle,"flex flex-row w-full shrink-0 items-center dark:bg-slate-900"])},[$(s.$slots,"default")],2),e("div",ea,[n(je,{menu:a.menu,"is-compact":a.isCompact,"active-secondary-menu-key":a.activeSecondaryMenuKey,onMenuClick:o},null,8,["menu","is-compact","active-secondary-menu-key"])]),$(s.$slots,"footer")],2)],2))}},aa={class:"flex flex-row items-center justify-center p-2 dark:bg-slate-900"},ta=["src"],ia={class:"hidden lg:block"},la={class:"flex-1"},oa={__name:"AsideMenu",props:{menu:{type:Array,required:!0}},emits:["menu-click"],setup(a,{emit:m}){const l=m,r=H(),o=P(!0),s=P(null),v=j(()=>s.value?"flex":o.value?"pointer-events-none":"hidden lg:flex"),f=()=>{s.value=null},p=(x,b)=>{l("menu-click",x,b),b.menu&&(o.value=!1),b.menuSecondary&&(s.value&&b.key===s.value.key?f():s.value=b)},u=(x,b)=>{l("menu-click",x,b)},d=()=>{s.value?f():o.value||(o.value=!0)};window.addEventListener("keydown",x=>{x.key==="Escape"&&(s.value||!o.value)&&d()}),G().afterEach(()=>{o.value=!0});const S=j(()=>({label:o.value?"Pro\u0161iri":"Smanji",icon:o.value?$e:Pe,color:"info",size:24}));return(x,b)=>{var B;const D=xe("router-link");return c(),M(Z,null,[n(ne,{menu:a.menu,class:g([t(r).isAsideMobileExpanded?"left-0":"-left-60 lg:left-0",(o.value,""),{"lg:hidden xl:flex":!t(r).isAsideLgActive}]),"is-compact":o.value,"z-index":s.value?"z-40 md:z-50":"z-50","active-secondary-menu-key":(B=s.value)==null?void 0:B.key,onMenuClick:p},{footer:h(()=>[e("ul",ia,[n(be,{item:S.value,"is-compact":o.value,onMenuClick:b[0]||(b[0]=V=>o.value=!o.value)},null,8,["item","is-compact"])])]),default:h(()=>[n(D,{to:"/"},{default:h(()=>[e("div",aa,[e("img",{src:t(Ze),class:"max-h-14 object-contain"},null,8,ta)])]),_:1})]),_:1},8,["menu","class","is-compact","z-index","active-secondary-menu-key"]),s.value?(c(),y(ne,{key:0,menu:s.value.menuSecondary,onMenuClick:u,class:g([[o.value?"lg:left-22":"md:left-60"],"right-0 md:right-auto animate-fade-in-right-fast lg:animate-fade-in-left-fast"])},{default:h(()=>[s.value.icon?(c(),y(_,{key:0,path:s.value.icon,w:"w-16"},null,8,["path"])):w("",!0),e("div",la,K(s.value.label),1),n(_,{path:t(pe),class:"cursor-pointer",w:"w-12",onClick:f},null,8,["path"])]),_:1},8,["menu","class"])):w("",!0),n(ge,{type:v.value,"z-index":"z-40",onOverlayClick:d},null,8,["type"])],64)}}},na=[{to:"/moja-praksa",icon:fe,label:"Moja praksa"},{to:"/poslodavci",icon:q,label:"Poslodavci"}],sa=[[{isCurrentUser:!0,menu:[{icon:X,label:"Moj profil",to:"/profil"},{icon:T,label:"Poruke",to:"/poruke"}]},{icon:ee,label:"Pomo\u0107",isDesktopNoLabel:!0,isHelp:!0,size:22},{icon:ae,label:"Prijavi bug",isDesktopNoLabel:!0,externalURL:"https://github.com/lukablaskovic/fipu-internship-frontend/issues",size:22},{icon:te,label:"Promjena teme",isDesktopNoLabel:!0,isToggleLightDark:!0},{icon:ie,label:"Odjava",isDesktopNoLabel:!0,isLogout:!0}],[{icon:X,label:"Moj profil",to:"/profil"},{icon:T,label:"Poruke",to:"/poruke"},{icon:ee,label:"Pomo\u0107",isDesktopNoLabel:!0,isHelp:!0,size:22},{icon:ae,label:"Prijavi bug",isDesktopNoLabel:!0,externalURL:"https://github.com/lukablaskovic/fipu-internship-frontend/issues",size:22},{icon:te,label:"Promjena teme",isDesktopNoLabel:!0,isToggleLightDark:!0},{icon:ie,label:"Odjava",isDesktopNoLabel:!0,isLogout:!0}]],ua=["src","alt"],ra={__name:"UserAvatar",props:{username:{type:String,default:null},avatar:{type:String,default:null}},setup(a){const m=a,l=j(()=>m.username);return(r,o)=>(c(),M("div",null,[e("img",{src:a.avatar,alt:l.value,class:"rounded-full block h-auto w-full max-w-full bg-gray-100 dark:bg-slate-800 aspect-square"},null,8,ua),$(r.$slots,"default")]))}},ca="/small_loading_gif.gif",da={__name:"UserAvatarCurrentUser",setup(a){return(m,l)=>(c(),y(ra,{username:t(k).currentUser.username,avatar:t(k).avatarChanging?t(ca):t(k).currentUser.avatar},{default:h(()=>[$(m.$slots,"default")]),_:3},8,["username","avatar"]))}},ma={__name:"NavBarItem",props:{item:{type:Object,required:!0}},emits:["menu-click"],setup(a,{emit:m}){const l=H(),r=a,o=m,s=j(()=>r.item.href?"a":r.item.to?ke:"div"),v=j(()=>{const x=[p.value?`${A.navBarItemLabelActiveColorStyle} dark:text-slate-400`:`${A.navBarItemLabelStyle} dark:text-white dark:hover:text-slate-400 ${A.navBarItemLabelHoverStyle}`,r.item.menu?"lg:py-2 lg:px-3":"py-2 px-3"];return r.item.isDesktopNoLabel&&x.push("lg:w-16","lg:justify-center"),x}),f=j(()=>r.item.isCurrentUser?k.currentUser.username||`${k.currentUser.ime} ${k.currentUser.prezime}`:r.item.label),p=P(!1),u=x=>{if(o("menu-click",x,r.item),l.tooltip.content="",r.item.externalURL){window.open(r.item.externalURL,"_blank");return}r.item.menu&&(p.value=!p.value)},d=(x,b)=>{o("menu-click",x,b)},I=P(null),S=x=>{I.value&&!I.value.contains(x.target)&&(p.value=!1)};return re(()=>{r.item.menu&&window.addEventListener("click",S)}),_e(()=>{r.item.menu&&window.removeEventListener("click",S)}),(x,b)=>{var D,B,V;return a.item.isDivider?(c(),y(z,{key:0,"nav-bar":""})):(c(),y(se(s.value),{key:1,ref_key:"root",ref:I,class:g(["block lg:flex items-center relative cursor-pointer",v.value]),to:(D=a.item.to)!=null?D:null,href:(B=a.item.href)!=null?B:null,target:(V=a.item.target)!=null?V:null,onClick:u},{default:h(()=>[e("div",{class:g(["flex items-center",{"bg-gray-100 dark:bg-slate-800 lg:bg-transparent lg:dark:bg-transparent p-3 lg:p-0":a.item.menu}])},[a.item.isCurrentUser?(c(),y(da,{key:0,class:"w-6 h-6 mr-3 inline-flex"})):w("",!0),a.item.icon?(c(),y(_,{key:1,size:a.item.size?a.item.size:19,path:a.item.icon,class:"transition-colors text-fipu_gray hover:text-fipu_blue dark:text-white dark:hover:text-fipu_blue",onMouseover:b[0]||(b[0]=F=>a.item.isDesktopNoLabel?t(l).tooltip={content:f.value,offsetx:0,offsety:40,justify:"justify-center items-center"}:""),onMouseleave:b[1]||(b[1]=F=>t(l).tooltip={content:"",offsetx:0,offsety:0})},null,8,["size","path"])):w("",!0),e("span",{class:g(["px-2 transition-colors text-base",{"lg:hidden":a.item.isDesktopNoLabel&&a.item.icon}])},K(f.value),3),a.item.menu!=null?(c(),y(_,{key:2,path:p.value?t(Be):t(Ne),class:"hidden lg:inline-flex transition-colors"},null,8,["path"])):w("",!0)],2),a.item.menu?(c(),M("div",{key:0,style:ce(p.value?"height: "+a.item.menu.length*42+"px;":"height: 0px;"),class:"text-sm lg:absolute lg:top-full lg:left-0 lg:min-w-full overflow-hidden lg:z-20 lg:rounded-lg lg:shadow-lg transition-size duration-300 bg-gray-100 dark:bg-slate-800"},[n(he,{"is-submenu":!0,menu:a.item.menu,onMenuClick:d},null,8,["menu"])],4)):w("",!0)]),_:1},8,["class","to","href","target"]))}}},he={__name:"NavBarMenuList",props:{menu:{type:Array,default:()=>[]},isSubmenu:{type:Boolean,default:!1}},emits:["menu-click"],setup(a,{emit:m}){const l=H(),r=m,o=(s,v)=>{r("menu-click",s,v)};return(s,v)=>(c(!0),M(Z,null,ue(a.isSubmenu?a.menu:a.menu[t(l).isLg?0:1],(f,p)=>(c(),y(ma,{key:p,item:f,onMenuClick:o},null,8,["item"]))),128))}},E={__name:"NavBarItemPlain",props:{display:{type:String,default:"flex"},useMargin:Boolean},setup(a){return(m,l)=>(c(),M("div",{class:g([[a.display,t(A).navBarItemLabelStyle,t(A).navBarItemLabelHoverStyle,a.useMargin?"my-2 mx-3":"py-2 px-3"],"items-center cursor-pointer dark:text-white dark:hover:text-slate-400"])},[$(m.$slots,"default")],2))}},va={class:"top-0 inset-x-0 fixed bg-gray-50 h-14 z-30 transition-position w-screen lg:w-auto dark:bg-slate-800"},pa={class:"flex flex-1 items-stretch h-14"},fa={class:"flex-none items-stretch flex h-14 lg:hidden"},ka={__name:"NavBar",props:{menu:{type:Array,required:!0}},emits:["menu-click"],setup(a,{emit:m}){const l=H(),r=m,o=(v,f)=>{r("menu-click",v,f)},s=P(!1);return(v,f)=>(c(),M("nav",va,[e("div",{class:g(["flex lg:items-stretch",t(Re)])},[e("div",pa,[$(v.$slots,"default")]),e("div",fa,[n(E,{onClick:f[0]||(f[0]=R(p=>s.value=!s.value,["prevent"]))},{default:h(()=>[n(_,{path:s.value?t(pe):t(De),size:"24"},null,8,["path"])]),_:1})]),e("div",{class:g(["max-h-screen-menu overflow-y-auto lg:overflow-visible fipu_vertical_scrollbar absolute w-screen top-14 -left-2 transition-size duration-300 bg-gray-50 shadow-lg lg:w-auto lg:flex lg:static lg:shadow-none dark:bg-slate-800",[s.value?"h-64 lg:h-auto":"h-0 lg:h-auto"]]),style:ce(s.value&&!t(l).isLg?"height: "+a.menu[1].length*42+"px;":"")},[n(he,{menu:a.menu,onMenuClick:o},null,8,["menu"])],6)],2)]))}};const ga={__name:"CardBoxModal",props:{title:{type:String,required:!0},button:{type:String,default:"fipu_blue"},buttonLabel:{type:String,default:"Done"},hasCancel:Boolean,modelValue:{type:[String,Number,Boolean,Object],default:null},disabledCondition:{type:Boolean,default:!1},hasConfirm:{type:Boolean,default:!0},large:{type:Boolean,default:!1},isLogout:{type:Boolean,default:!1}},emits:["update:modelValue","cancel","confirm"],setup(a,{emit:m}){const l=a,r=m,o=j({get:()=>l.modelValue,set:p=>r("update:modelValue",p)}),s=p=>{o.value=!1,r(p)},v=()=>s("confirm"),f=()=>s("cancel");return window.addEventListener("keydown",p=>{p.key==="Escape"&&o.value&&f()}),(p,u)=>(c(),y(ge,{type:o.value?"":"pointer-events-none",class:"z-[5000]",onOverlayClick:f},{default:h(()=>[ze(n(Qe,{class:g({"rounded shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-2/5 xl:w-6/12 2xl:3/12 z-50 modal-scrollable fipu_vertical_scrollbar":!a.large&&!a.isLogout,"rounded shadow-lg max-h-modal w-full md:w-4/5 lg:w-3/5 xl:w-3/5 z-50 modal-scrollable fipu_vertical_scrollbar":a.large&&!a.isLogout,"rounded shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-1/5 xl:w-4/12 2xl:3/12 z-50 modal-scrollable fipu_vertical_scrollbar":a.isLogout}),"is-modal":""},{default:h(()=>[n(qe,{title:a.title},null,8,["title"]),a.modelValue!=null?$(p.$slots,"default",{key:0,assignment:a.modelValue},void 0,!0):w("",!0),n(Ye,{class:"justify-center"},{default:h(()=>[a.hasConfirm?(c(),y(le,{key:0,label:a.buttonLabel,color:a.button,disabled:a.disabledCondition,onClick:v},null,8,["label","color","disabled"])):w("",!0),a.hasCancel?(c(),y(le,{key:1,label:"Natrag",color:a.button,outline:"",onClick:f},null,8,["color"])):w("",!0)]),_:1})]),_:3},8,["class"]),[[we,o.value]])]),_:3},8,["type"]))}},O=Ke(ga,[["__scopeId","data-v-5ca4cdd1"]]);const ba=e("div",{class:"text-xl mb-2"},"O kolegiju",-1),ja=e("div",null,[i("Cilj kolegija "),e("b",null,"Stru\u010Dna praksa"),i(" je omogu\u0107iti studentima prakti\u010Dni rad u IT poduze\u0107ima na projektima oblikovanja i implementacije programske podr\u0161ke; usvajanja stru\u010Dnih kompetencija iz podru\u010Dja djelovanja organizacije u kojoj se praksa provodi te razvijanje osje\u0107aja odgovornosti i timskoga rada unutar zadanoga radnoga okru\u017Eenja.")],-1),ha=e("div",{class:"text-xl mb-2"},"Prijava na praksu",-1),ya=e("ol",{class:"list-decimal ml-4"},[e("li",null,[i(" Studenti se prijavljuju na praksu putem aplikacije "),e("em",null,"FIPU Praksa"),i(" u kojem prvo odabiru 3 zadatka koja bi \u017Eeljeli raditi. ")]),e("li",null,"Nakon \u0161to vas se alocira na jedan od prijavljenih zadataka, morate kontaktirati mentora. Predstavite se i recite da ste dobili zadatak. Poslodavac mo\u017Ee zatra\u017Eiti intervju ili provesti selekciju."),e("li",null,"Profesor mo\u017Ee i odbiti zadatke koje ste odabrali te vas vratiti na po\u010Detni korak odabira preferencija, ili vas mo\u017Ee alocirati na neko 4. poduze\u0107e ukoliko smatra da je to potrebno.")],-1),xa=e("div",{class:"text-xl mb-2"},"Izvo\u0111enje prakse",-1),_a={class:"list-decimal ml-4"},za=e("li",null,[i("Potrebno je s mentorom dogovoriti datum po\u010Dekta izvo\u0111enja prakse. Kada sve finalno dogovorite s mentorom popunite Prijavnicu putem aplikacije "),e("b",null,"prije po\u010Detka izvo\u0111enja prakse"),i(".")],-1),wa={class:"flex flex-wrap text-base"},Ma=e("li",null,[i("Nakon ispunjavanja prijavnice, na mail \u0107ete vi i mentor dobiti praznu Potvrdu. Mora ju ispuniti "),e("b",null,"mentor"),i(" i to po zavr\u0161etku odra\u0111enog posla.")],-1),Ca=e("li",null,"U\u017Eivajte u izvo\u0111enju prakse \u{1F642} Have fun i u\u010Dite! Nemojte zaboraviti svakodnevno voditi Dnevnik!",-1),Sa=e("div",{class:"text-xl mb-2"},"Zavr\u0161etak prakse i prijava ispita",-1),La=e("ol",{class:"list-decimal ml-4"},[e("li",null,"Nakon \u0161to zavr\u0161ite sa stru\u010Dnom praksu potrebno je predati Dnevnik, tako\u0111er putem aplikacije."),e("li",null,[i(" Za kraj, potrebno je prijaviti ispit preko Studomata. Na ispit "),e("b",null,"ne morate"),i(" dolaziti, samo ga prijavite. ")])],-1),Aa=e("div",{class:"text-xl mb-2"},[i("Aplikacija "),e("em",null,"FIPU praksa")],-1),$a={class:"list-decimal ml-4"},Pa=e("li",null,[i(" Sve radnje (uklju\u010Duju\u0107i komunikaciju) vezane uz praksu obavljaju se isklju\u010Divo putem aplikacije "),e("em",null,"FIPU praksa"),i(". ")],-1),Ba={class:"flex flex-wrap text-base"},Na=e("li",null,"Putem iste poveznice predajete dnevnik prakse, dok prijavnicu dobivate na va\u0161 email.",-1),Da={class:"flex flex-wrap text-base"},Ua=e("p",null,[e("b",null,"Va\u017Eno!"),i(" Aplikacija "),e("em",null,"FIPU Praksa"),i(" razvijena je 2023. godine u sklopu istra\u017Eiva\u010Dkog laboratorija FIPU-lab za potrebe pojednostavljenja i automatizacije procesa izvo\u0111enja studentske prakse, za studente, voditelja te poslodavce.")],-1),Ia=e("p",{class:"mt-2"},"Aplikacija je razvijena eksperimentalnim BPMN model-based development-om i integracijom mikroservisa te je, kao i svaki drugi programski proizvod, podlo\u017Ena bugovima\u{1F41E}!",-1),Va=e("p",{class:"mt-2"},[i("Stoga vas molimo da sve bugove koje prona\u0111ete prijavite otvaranjem novog Github issue-a, "),e("a",{class:"hover-underline-animation cursor-pointer text-fipu_text_blue",target:"_blank",href:"https://github.com/lukablaskovic/fipu-internship-frontend/issues"},"ovdje!")],-1),Ha=e("p",{class:"mt-2"},"Hvala! \u{1F642}",-1),Ea=e("div",{class:"text-xl mb-2"},"O kolegiju",-1),Ta=e("div",null,[i("Cilj kolegija "),e("b",null,"Stru\u010Dna praksa"),i(" je omogu\u0107iti studentima prakti\u010Dni rad u IT poduze\u0107ima na projektima oblikovanja i implementacije programske podr\u0161ke; usvajanja stru\u010Dnih kompetencija iz podru\u010Dja djelovanja organizacije u kojoj se praksa provodi te razvijanje osje\u0107aja odgovornosti i timskoga rada unutar zadanoga radnoga okru\u017Eenja.")],-1),Fa=e("div",{class:"text-xl mb-2"},"Prijava na praksu",-1),Oa={class:"list-decimal ml-4"},Ra=e("li",null,[i(" Studenti se prijavljuju na praksu putem aplikacije "),e("em",null,"FIPU Praksa"),i(" u kojem prvo odabiru 3 zadatka koja bi \u017Eeljeli raditi. ")],-1),Ka={class:"flex flex-wrap text-base"},Za=e("li",null,'Nakon odabira studenta, odaberite "Alociranje studenta na zadatak" na BPMN grafu. Nakon toga odaberite zadatak i potvrdite.',-1),qa=e("li",null,"Mo\u017Eete i odbiti preferencije nakon \u010Dega se studenta vra\u0107a na po\u010Detni korak.",-1),Ga=e("div",{class:"text-xl mb-2"},"Dashboard",-1),Ja=e("ol",{class:"list-decimal ml-4"},[e("li",null,[i("Dashboard se trenutno sastoji od 2 dijela - "),e("b",null,"Nadzorna plo\u010Da"),i(", gdje mo\u017Eete vidjeti op\u0107enite numeri\u010Dke podatke o izvo\u0111enju prakse, te "),e("b",null,"Najnoviji doga\u0111aji"),i(", gdje se nalaze event logovi iz BPMN engine-a")]),e("li",null,"Mo\u017Eete stisnuti na pojedini event log, \u0161to \u0107e vas odnijeti na studenti/:id gdje je id jednak instanci tog procesa prakse za tog studenta"),e("li",null,[i("Tra\u017Eilicu mo\u017Eete otvoriti pritiskom "),e("b",null,"CTRL + k"),i(". Obi\u010Dnim upisivanjem mo\u017Eete brzo prelaziti kroz stranice aplikacije, a prefiksima (ispisani su u uputama tra\u017Eilice) mogu se tra\u017Eiti odre\u0111ene stavke, poput studenata po JMBAGU, emailu, ili poduze\u0107a.")])],-1),Ya=e("div",{class:"text-xl mb-2"},"Alokacije",-1),Qa={class:"list-decimal ml-4"},Wa={class:"flex flex-wrap text-base"},Xa=e("li",null,[i("Postoji nekoliko stanja alokacija: "),e("em",null,"student_prihva\u0107en"),i(", "),e("em",null,"student_odbijen"),i(", "),e("em",null,"evaluacija_u_tijeku"),i(", "),e("em",null,"student_odustao"),i(", "),e("em",null,"profesor_ponistio"),i(".")],-1),et=e("li",null,[i("U alokaciji se za sada prikazuju: "),e("em",null,"student_prihva\u0107en"),i(", "),e("em",null,"evaluacija_u_tijeku"),i(),e("em",null,"te student_odbijen"),i(".")],-1),at=e("li",null,"Mo\u017Eete za svakog studenta pregledati dnevnik prakse te poslanu prijavnicu.",-1),tt=e("div",{class:"text-xl mb-2"},"Poslodavci",-1),it={class:"list-decimal ml-4"},lt={class:"flex flex-wrap text-base"},ot=e("li",null,[i("Poslodavci su podijeljeni u 2 tablice: "),e("b",null,"Novi Poslodavci"),i(" i "),e("b",null,"Svi Poslodavci"),i(". Tablica Novi Poslodavci \u0107e prikazivati nove retke nakon \u0161to novo poduze\u0107e (koje jo\u0161 nije partner) prijavi zadatak.")],-1),nt=e("li",null,"Tada je potrebno ru\u010Dno unijeti podatke o poduze\u0107u",-1),st=e("li",null,"Podatke o poslodavcu je mogu\u0107e i direktno a\u017Eurirati Baserowu.",-1),ut=e("div",{class:"text-xl mb-2"},"Dostupni Zadaci",-1),rt={class:"list-decimal ml-4"},ct={class:"flex flex-wrap text-base"},dt=e("li",null,[i("Tu mo\u017Eete vidjeti podjelu na "),e("b",null,"Novi Zadaci"),i(", "),e("b",null,"Aktivni Zadaci"),i(" te "),e("b",null,"Odbijeni Zadaci"),i(".")],-1),mt=e("li",null,"Zadatak novog partnera je mogu\u0107e odobriti i prije a\u017Euriranja podataka novog poduze\u0107a.",-1),vt=e("li",null,"Na ovoj stranici tako\u0111er mo\u017Eete prona\u0107i javni link koji se proslije\u0111uje poslodavcima za prijavu novog zadatka.",-1),pt=e("p",null,[e("b",null,"Va\u017Eno!"),i(" Aplikacija "),e("em",null,"Fipu Praksa"),i(" razvijena je 2023. godine u sklopu istra\u017Eiva\u010Dkog laboratorija FIPU-lab za potrebe pojednostavljenja i automatizacije procesa izvo\u0111enja studentske prakse, za studente, voditelja te poslodavce.")],-1),ft=e("p",{class:"mt-2"},"Aplikacija je razvijena eksperimentalnim BPMN model-based development-om i integracijom mikroservisa te je, kao i svaki drugi programski proizvod, podlo\u017Ena bugovima\u{1F41E}!",-1),kt=e("p",{class:"mt-2"},[i("Stoga vas molimo da sve bugove koje prona\u0111ete prijavite otvaranjem novog Github issue-a, "),e("a",{class:"hover-underline-animation cursor-pointer text-fipu_text_blue",target:"_blank",href:"https://github.com/lukablaskovic/fipu-internship-frontend/issues"},"ovdje!")],-1),gt=e("p",{class:"mt-2"},"Hvala! \u{1F642}",-1),bt={class:"grow relative"},jt={class:"mt-6"},ht=e("br",null,null,-1),yt=e("span",{style:{color:"#e25555"}},"\u2665",-1),St={__name:"LayoutAuthenticated",setup(a){const m=j(()=>L.isAsideLgActive?"lg:pl-22":"xl:pl-22"),l=G(),r=j(()=>k.logoutModalActive),o=j(()=>k.helpModalActive),s=P(!1);let v=P([]);re(()=>{s.value=k.userAdmin,s.value&&(v.value=We),s.value||(v.value=na)}),l.beforeEach(()=>{L.isAsideMobileExpanded=!1});const f=(p,u)=>{u.isToggleLightDark&&A.setDarkMode(),u.isLogout&&k.activateLogoutModal(!0),u.isHelp&&k.activateHelpModal(!0)};return(p,u)=>(c(),M("div",{class:g({dark:t(A).darkMode,"overflow-hidden lg:overflow-visible":t(L).isAsideMobileExpanded})},[e("div",{class:g([[m.value,{"ml-60 lg:ml-0":t(L).isAsideMobileExpanded}],"pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100 flex flex-col"])},[n(ka,{menu:t(sa),class:g([m.value,{"ml-60 lg:ml-0":t(L).isAsideMobileExpanded}]),onMenuClick:f},{default:h(()=>[n(E,{display:"flex lg:hidden",onClick:u[0]||(u[0]=R(d=>t(L).asideMobileToggle(),["prevent"]))},{default:h(()=>[n(_,{path:t(L).isAsideMobileExpanded?t(oe):t(Ue),size:"24"},null,8,["path"])]),_:1}),n(E,{display:"hidden lg:flex xl:hidden",onClick:u[1]||(u[1]=R(d=>t(L).asideLgToggle(),["prevent"]))},{default:h(()=>[n(_,{path:t(L).isAsideLgActive?t(oe):t(Ie),size:"24"},null,8,["path"])]),_:1}),n(E,{"use-margin":""},{default:h(()=>[n(Ve,{icon:t(He),"search-bar":"",borderless:""},null,8,["icon"])]),_:1})]),_:1},8,["menu","class"]),n(O,{modelValue:r.value,"onUpdate:modelValue":u[2]||(u[2]=d=>r.value=d),"has-cancel":"","is-logout":"",title:"Jeste li sigurni da se \u017Eelite odjaviti?","button-label":"Odjava",class:"z-100",onCancel:u[3]||(u[3]=d=>t(k).activateLogoutModal(!1)),onConfirm:u[4]||(u[4]=d=>t(k).logout())},null,8,["modelValue"]),t(k).userAdmin?(c(),y(O,{key:1,modelValue:o.value,"onUpdate:modelValue":u[14]||(u[14]=d=>o.value=d),"has-cancel":"","has-confirm":!1,title:"\u2139\uFE0F Upute za kori\u0161tenje aplikacije","button-label":"Povratak",onCancel:u[15]||(u[15]=d=>t(k).activateHelpModal(!1))},{default:h(()=>[n(z),Ea,Ta,n(z),Fa,e("ol",Oa,[Ra,e("li",null,[e("div",Ka,[i(" Studente mo\u017Eete alocirati putem "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:u[10]||(u[10]=d=>t(l).push("/studenti")&&t(k).activateHelpModal(!1))},[n(_,{path:t(de),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Studenti ")]),i(". ")])]),Za,qa]),n(z),Ga,Ja,n(z),Ya,e("ol",Qa,[e("li",null,[e("div",Wa,[i(" Alokacije mo\u017Eete provjeriti u "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:u[11]||(u[11]=d=>t(l).push("/alokacije")&&t(k).activateHelpModal(!1))},[n(_,{path:t(me),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Alokacije ")]),i(". ")])]),Xa,et,at]),n(z),tt,e("ol",it,[e("li",null,[e("div",lt,[i(" Sve prijavljene poslodavce mo\u017Eete prona\u0107i u "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:u[12]||(u[12]=d=>t(l).push("/poslodavci")&&t(k).activateHelpModal(!1))},[n(_,{path:t(q),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Poslodavci ")]),i(". ")])]),ot,nt,st]),n(z),ut,e("ol",rt,[e("li",null,[e("div",ct,[i(" Novo-prijavljene zadatke mo\u017Eete prona\u0107i u "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:u[13]||(u[13]=d=>t(l).push("/dostupni-zadaci")&&t(k).activateHelpModal(!1))},[n(_,{path:t(ve),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Dostupni zadaci ")]),i(". ")])]),dt,mt,vt]),n(z),pt,ft,kt,gt]),_:1},8,["modelValue"])):(c(),y(O,{key:0,modelValue:o.value,"onUpdate:modelValue":u[8]||(u[8]=d=>o.value=d),"has-cancel":"","has-confirm":!1,title:"\u2139\uFE0F Upute za kori\u0161tenje aplikacije","button-label":"Povratak",onCancel:u[9]||(u[9]=d=>t(k).activateHelpModal(!1))},{default:h(()=>[n(z),ba,ja,n(z),ha,ya,n(z),xa,e("ol",_a,[za,e("li",null,[e("div",wa,[i(" Niste dobili email? Javite se profesoru putem "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:u[5]||(u[5]=d=>t(l).push("/poruke")&&t(k).activateHelpModal(!1))},[n(_,{path:t(T),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Poruke ")]),i(". ")])]),Ma,Ca]),n(z),Sa,La,n(z),Aa,e("ol",$a,[Pa,e("li",null,[e("div",Ba,[i(" Ovisno o stanju va\u0161e prakse, "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:u[6]||(u[6]=d=>t(l).push("/moja-praksa")&&t(k).activateHelpModal(!1))},[n(_,{path:t(fe),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Moja praksa ")]),i(" \xA0se a\u017Eurira automatski. ")])]),Na,e("li",null,[e("div",Da,[i(" Komunikaciju s profesorom vr\u0161ite putem "),e("span",{class:"text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center",onClick:u[7]||(u[7]=d=>t(l).push("/poruke")&&t(k).activateHelpModal(!1))},[n(_,{path:t(T),class:"flex-none align-middle",size:18},null,8,["path"]),i(" Poruke ")]),i(". ")])])]),n(z),Ua,Ia,Va,Ha]),_:1},8,["modelValue"])),n(oa,{menu:t(v),onMenuClick:f},null,8,["menu"]),e("div",bt,[$(p.$slots,"default")]),e("div",jt,[n(Ge,null,{default:h(()=>[ht,i(" Made with "),yt,i(" at FIPU.lab")]),_:1})]),n(Je)],2)],2))}};export{O as C,ra as _,St as a,E as b,ka as c,oa as d,da as e};
