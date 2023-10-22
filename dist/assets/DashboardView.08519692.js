import{_ as H,b as xe,a as p,U as L,s as te,d as Se,c as we,o as Ie,m as Me}from"./index.fe929ab9.js";import{ao as Ee,ap as Ce,aq as Te,ar as E,as as Re,at as $e,au as U,av as W,aw as ae,ax as je,ay as Ae,az as De,aA as oe,aB as Pe,aC as Be,aD as Fe,aE as $,aF as I,aG as Oe,aH as re,aI as fe,aJ as Ne,aK as Le,a8 as Ge,a9 as Ve,aL as ze,z as qe,aM as He,aN as Ue,aO as Je,a as ue,y as Ke,aP as We,aQ as Ye,L as Qe,aR as Ze,aS as Xe,aT as et,aU as tt,_ as at}from"./BaseButton.4d949780.js";import{h as de}from"./moment-setup.c6085169.js";import{b as lt,_ as ce,a as st}from"./SectionTitleLineWithButton.8492240e.js";import{A as j,_ as B}from"./maps.e07f7025.js";import{_ as nt}from"./CardBox.85c849c3.js";import{a as J}from"./TableAvailableAssignments.8c33d5c6.js";import{k as Y,r as k,f as x,p as it,q as K,D as ot,E as rt,n as N,i as ut,x as u,G as w,J as R,F as y,z as v,A as P,u as s,y as T,a5 as dt,T as ct,C as ve,H as G,M as V,Q as vt,w as pe,K as Z}from"./vue.7e7f5872.js";import{a as pt}from"./LayoutAuthenticated.fcf4a773.js";import{_ as mt}from"./BaseButtons.06021fb9.js";import"./vendor.4c47bd8f.js";import"./validators.2340ccfd.js";import"./SnackBar.c6f23902.js";import"./FormCheckRadio.eb16ec4e.js";import"./FormField.fb83542c.js";import"./FormFilePicker.78b9d114.js";import"./FormCheckRadioGroup.c52e2c40.js";import"./LoadingOverlay.2ccac9fd.js";var ft=(a=>(a[a.Open=0]="Open",a[a.Closed=1]="Closed",a))(ft||{}),gt=(a=>(a[a.Pointer=0]="Pointer",a[a.Other=1]="Other",a))(gt||{});function _t(a){requestAnimationFrame(()=>requestAnimationFrame(a))}let ge=Symbol("MenuContext");function Q(a){let d=ut(ge,null);if(d===null){let g=new Error(`<${a} /> is missing a parent <Menu /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(g,Q),g}return d}let ht=Y({name:"Menu",props:{as:{type:[Object,String],default:"template"}},setup(a,{slots:d,attrs:g}){let h=k(1),e=k(null),S=k(null),_=k([]),b=k(""),m=k(null),l=k(1);function t(o=n=>n){let n=m.value!==null?_.value[m.value]:null,r=Ne(o(_.value.slice()),M=>E(M.dataRef.domRef)),i=n?r.indexOf(n):null;return i===-1&&(i=null),{items:r,activeItemIndex:i}}let f={menuState:h,buttonRef:e,itemsRef:S,items:_,searchQuery:b,activeItemIndex:m,activationTrigger:l,closeMenu:()=>{h.value=1,m.value=null},openMenu:()=>h.value=0,goToItem(o,n,r){let i=t(),M=Fe(o===$.Specific?{focus:$.Specific,id:n}:{focus:o},{resolveItems:()=>i.items,resolveActiveIndex:()=>i.activeItemIndex,resolveId:D=>D.id,resolveDisabled:D=>D.dataRef.disabled});b.value="",m.value=M,l.value=r!=null?r:1,_.value=i.items},search(o){let n=b.value!==""?0:1;b.value+=o.toLowerCase();let r=(m.value!==null?_.value.slice(m.value+n).concat(_.value.slice(0,m.value+n)):_.value).find(M=>M.dataRef.textValue.startsWith(b.value)&&!M.dataRef.disabled),i=r?_.value.indexOf(r):-1;i===-1||i===m.value||(m.value=i,l.value=1)},clearSearch(){b.value=""},registerItem(o,n){let r=t(i=>[...i,{id:o,dataRef:n}]);_.value=r.items,m.value=r.activeItemIndex,l.value=1},unregisterItem(o){let n=t(r=>{let i=r.findIndex(M=>M.id===o);return i!==-1&&r.splice(i,1),r});_.value=n.items,m.value=n.activeItemIndex,l.value=1}};return Ee([e,S],(o,n)=>{var r;f.closeMenu(),Ce(n,Te.Loose)||(o.preventDefault(),(r=E(e))==null||r.focus())},x(()=>h.value===0)),it(ge,f),Re(x(()=>$e(h.value,{[0]:U.Open,[1]:U.Closed}))),()=>{let o={open:h.value===0,close:f.closeMenu};return W({ourProps:{},theirProps:a,slot:o,slots:d,attrs:g,name:"Menu"})}}}),bt=Y({name:"MenuButton",props:{disabled:{type:Boolean,default:!1},as:{type:[Object,String],default:"button"},id:{type:String,default:()=>`headlessui-menu-button-${ae()}`}},setup(a,{attrs:d,slots:g,expose:h}){let e=Q("MenuButton");h({el:e.buttonRef,$el:e.buttonRef});function S(l){switch(l.key){case I.Space:case I.Enter:case I.ArrowDown:l.preventDefault(),l.stopPropagation(),e.openMenu(),N(()=>{var t;(t=E(e.itemsRef))==null||t.focus({preventScroll:!0}),e.goToItem($.First)});break;case I.ArrowUp:l.preventDefault(),l.stopPropagation(),e.openMenu(),N(()=>{var t;(t=E(e.itemsRef))==null||t.focus({preventScroll:!0}),e.goToItem($.Last)});break}}function _(l){switch(l.key){case I.Space:l.preventDefault();break}}function b(l){a.disabled||(e.menuState.value===0?(e.closeMenu(),N(()=>{var t;return(t=E(e.buttonRef))==null?void 0:t.focus({preventScroll:!0})})):(l.preventDefault(),e.openMenu(),_t(()=>{var t;return(t=E(e.itemsRef))==null?void 0:t.focus({preventScroll:!0})})))}let m=je(x(()=>({as:a.as,type:d.type})),e.buttonRef);return()=>{var l;let t={open:e.menuState.value===0},{id:f,...o}=a,n={ref:e.buttonRef,id:f,type:m.value,"aria-haspopup":"menu","aria-controls":(l=E(e.itemsRef))==null?void 0:l.id,"aria-expanded":e.menuState.value===0,onKeydown:S,onKeyup:_,onClick:b};return W({ourProps:n,theirProps:o,slot:t,attrs:d,slots:g,name:"MenuButton"})}}}),yt=Y({name:"MenuItems",props:{as:{type:[Object,String],default:"div"},static:{type:Boolean,default:!1},unmount:{type:Boolean,default:!0},id:{type:String,default:()=>`headlessui-menu-items-${ae()}`}},setup(a,{attrs:d,slots:g,expose:h}){let e=Q("MenuItems"),S=k(null);h({el:e.itemsRef,$el:e.itemsRef}),Ae({container:x(()=>E(e.itemsRef)),enabled:x(()=>e.menuState.value===0),accept(t){return t.getAttribute("role")==="menuitem"?NodeFilter.FILTER_REJECT:t.hasAttribute("role")?NodeFilter.FILTER_SKIP:NodeFilter.FILTER_ACCEPT},walk(t){t.setAttribute("role","none")}});function _(t){var f;switch(S.value&&clearTimeout(S.value),t.key){case I.Space:if(e.searchQuery.value!=="")return t.preventDefault(),t.stopPropagation(),e.search(t.key);case I.Enter:if(t.preventDefault(),t.stopPropagation(),e.activeItemIndex.value!==null){let o=e.items.value[e.activeItemIndex.value];(f=E(o.dataRef.domRef))==null||f.click()}e.closeMenu(),fe(E(e.buttonRef));break;case I.ArrowDown:return t.preventDefault(),t.stopPropagation(),e.goToItem($.Next);case I.ArrowUp:return t.preventDefault(),t.stopPropagation(),e.goToItem($.Previous);case I.Home:case I.PageUp:return t.preventDefault(),t.stopPropagation(),e.goToItem($.First);case I.End:case I.PageDown:return t.preventDefault(),t.stopPropagation(),e.goToItem($.Last);case I.Escape:t.preventDefault(),t.stopPropagation(),e.closeMenu(),N(()=>{var o;return(o=E(e.buttonRef))==null?void 0:o.focus({preventScroll:!0})});break;case I.Tab:t.preventDefault(),t.stopPropagation(),e.closeMenu(),N(()=>Oe(E(e.buttonRef),t.shiftKey?re.Previous:re.Next));break;default:t.key.length===1&&(e.search(t.key),S.value=setTimeout(()=>e.clearSearch(),350));break}}function b(t){switch(t.key){case I.Space:t.preventDefault();break}}let m=De(),l=x(()=>m!==null?(m.value&U.Open)===U.Open:e.menuState.value===0);return()=>{var t,f;let o={open:e.menuState.value===0},{id:n,...r}=a,i={"aria-activedescendant":e.activeItemIndex.value===null||(t=e.items.value[e.activeItemIndex.value])==null?void 0:t.id,"aria-labelledby":(f=E(e.buttonRef))==null?void 0:f.id,id:n,onKeydown:_,onKeyup:b,role:"menu",tabIndex:0,ref:e.itemsRef};return W({ourProps:i,theirProps:r,slot:o,attrs:d,slots:g,features:oe.RenderStrategy|oe.Static,visible:l.value,name:"MenuItems"})}}}),kt=Y({name:"MenuItem",inheritAttrs:!1,props:{as:{type:[Object,String],default:"template"},disabled:{type:Boolean,default:!1},id:{type:String,default:()=>`headlessui-menu-item-${ae()}`}},setup(a,{slots:d,attrs:g,expose:h}){let e=Q("MenuItem"),S=k(null);h({el:S,$el:S});let _=x(()=>e.activeItemIndex.value!==null?e.items.value[e.activeItemIndex.value].id===a.id:!1),b=Pe(S),m=x(()=>({disabled:a.disabled,get textValue(){return b()},domRef:S}));K(()=>e.registerItem(a.id,m)),ot(()=>e.unregisterItem(a.id)),rt(()=>{e.menuState.value===0&&_.value&&e.activationTrigger.value!==0&&N(()=>{var i,M;return(M=(i=E(S))==null?void 0:i.scrollIntoView)==null?void 0:M.call(i,{block:"nearest"})})});function l(i){if(a.disabled)return i.preventDefault();e.closeMenu(),fe(E(e.buttonRef))}function t(){if(a.disabled)return e.goToItem($.Nothing);e.goToItem($.Specific,a.id)}let f=Be();function o(i){f.update(i)}function n(i){f.wasMoved(i)&&(a.disabled||_.value||e.goToItem($.Specific,a.id,0))}function r(i){f.wasMoved(i)&&(a.disabled||_.value&&e.goToItem($.Nothing))}return()=>{let{disabled:i}=a,M={active:_.value,disabled:i,close:e.closeMenu},{id:D,...z}=a;return W({ourProps:{id:D,ref:S,role:"menuitem",tabIndex:i===!0?void 0:-1,"aria-disabled":i===!0?!0:void 0,disabled:void 0,onClick:l,onFocus:t,onPointerenter:o,onMouseenter:o,onPointermove:n,onMousemove:n,onPointerleave:r,onMouseleave:r},theirProps:{...g,...z},slot:M,attrs:g,slots:d,name:"MenuItem"})}}});const xt={class:"text-center space-y-1 md:text-left md:mr-6"},St={class:"text-xl"},wt={class:"text-gray-500 dark:text-slate-400"},It={class:"text-gray-500 dark:text-slate-400"},Mt={class:"text-center md:text-right space-y-2"},Et={class:"text-sm text-gray-500"},me={__name:"CardBoxEvents",props:{student:{type:String,required:!0},date:{type:String,required:!0},type:{type:String,required:!0},jmbag:{type:String,required:!0},email:{type:String,required:!0}},setup(a){const d=a,g=x(()=>{const h=j.getEvent(d.type);return h?{icon:h.icon,type:h.type}:{icon:Le,type:"info"}});return(h,e)=>(u(),w(nt,{class:"mb-6 last:mb-0","is-hoverable":""},{default:R(()=>[y(H,null,{default:R(()=>[y(H,{type:"justify-start"},{default:R(()=>[y(lt,{icon:g.value.icon,color:g.value.type,class:"md:mr-6"},null,8,["icon","color"]),v("div",xt,[v("h4",St,P(a.student),1),v("p",wt,[v("b",null,"JMBAG: "+P(a.jmbag),1)]),v("p",It,[v("em",null,"Email: "+P(a.email),1)])])]),_:1}),v("div",Mt,[v("p",Et,P(d.date),1),v("div",null,[y(J,{color:g.value.type,label:s(j).getEvent(a.type).message,small:""},null,8,["color","label"])])])]),_:1})]),_:1}))}};const Ct={},Tt={class:"shadow rounded-md p-6 max-w-sm w-full mx-auto"},Rt=dt('<div class="flex-1 space-y-6 py-1"><div class="animate-pulse h-2 rounded"></div><div class="space-y-3"><div class="grid grid-cols-4 gap-4"><div class="animate-pulse h-2 rounded col-span-3"></div><div class="animate-pulse rounded-full h-10 w-10 col-span-1"></div></div><div class="animate-pulse h-2 rounded"></div></div></div>',1),$t=[Rt];function jt(a,d){return u(),T("div",Tt,$t)}const F=xe(Ct,[["render",jt]]);const At=v("div",{class:"shadow rounded-md p-6 w-full mx-auto m-2"},[v("div",{class:"flex-1 space-y-6 py-1"},[v("div",{class:"animate-pulse h-2 rounded"}),v("div",{class:"space-y-3"},[v("div",{class:"grid grid-cols-4 gap-4"},[v("div",{class:"animate-pulse h-2 rounded col-span-3"})]),v("div",{class:"animate-pulse h-2 rounded"})])])],-1),O={__name:"SkeletonLoaderEvent",setup(a){return(d,g)=>(u(),w(H,{"full-width":""},{default:R(()=>[At]),_:1}))}},Dt=v("div",{class:"p-2"},"Odaberite doga\u0111aje za koje \u017Eelite da se prikazuju",-1),Pt=["disabled","onClick"],Bt={class:"grow flex justify-start items-center text-left"},Ft={__name:"PillTagFilter",props:{trend:{type:String,required:!0},trendType:{type:String,default:null},small:Boolean,icon:{type:String,default:null},iconRight:{type:String,default:null},label:{type:String,default:null},options:{type:Array,required:!0},modelValue:{type:String,default:null},left:Boolean,iconW:{type:String,default:null},iconH:{type:String,default:null},iconSize:{type:[String,Number],default:null},color:{type:String,default:"lightDark"},outline:Boolean,disabled:Boolean},setup(a){const d=a;K(()=>{if(d.trendType==="filter"){const l=p.selectedEvents;e.value=[...l],L.isArrayEmpty(l)&&b()}});const g=x(()=>{const l=j.events.filter(t=>!j.skipEvents.includes(t.activity_id)&&!j.isGatewayEvent(t.activity_id)).map(t=>t.activity_id);return L.arraysEqual(p.selectedEvents,l)}),h=x(()=>{if(d.trendType==="up")return{icon:Ge,style:"success"};if(d.trendType==="down")return{icon:Ve,style:"danger"};if(d.trendType==="alert")return{icon:ze,style:"warning"};if(d.trendType==="filter")return{icon:g.value?qe:He,style:g.value?"fipu_blue":"success"};const l=defineEmits(["update:modelValue"]);return x({get:()=>d.modelValue,set:t=>{l("update:modelValue",t)}}),{style:"info"}}),e=k([]),S=async()=>{p.selectedEvents=e.value,te.pushMessage("Event-Filteri a\u017Eurirani!","success"),await L.wait(.5),location.reload()},_=l=>{let f=l.replace(/_/g," ").split(" ");for(let o=0;o<f.length;o++)f[o]=f[o].charAt(0).toUpperCase()+f[o].slice(1);return f.join(" ")},b=()=>{const l=j.events.filter(t=>!j.skipEvents.includes(t.activity_id)&&!j.isGatewayEvent(t.activity_id)).map(t=>t.activity_id);e.value=l,p.selectedEvents=l,te.pushMessage("Event-Filteri resetirani!","success")},m=l=>{const t=e.value.indexOf(l.label);t===-1?e.value.push(l.label):e.value.splice(t,1)};return(l,t)=>(u(),w(s(ht),{as:"div",class:"relative inline-block text-left"},{default:R(()=>[v("div",null,[y(s(bt),{disabled:a.disabled},{default:R(({open:f})=>[y(J,{label:a.trend,color:h.value.style,icon:h.value.icon,small:a.small,active:f,disabled:a.disabled},null,8,["label","color","icon","small","active","disabled"])]),_:1},8,["disabled"])]),y(ct,{"enter-active-class":"transition duration-100 ease-out","enter-from-class":"transform scale-95 opacity-0","enter-to-class":"transform scale-100 opacity-100","leave-active-class":"transition duration-75 ease-in","leave-from-class":"transform scale-100 opacity-100","leave-to-class":"transform scale-95 opacity-0"},{default:R(()=>[y(s(yt),{class:ve([a.left?"left-0":"right-0","absolute z-50 w-64 md:w-96 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-950 drop-shadow dark:divide-gray-700 h-96 overflow-x-hidden overflow-y-auto fipu_vertical_scrollbar"])},{default:R(()=>[Dt,(u(!0),T(G,null,V(a.options,(f,o)=>(u(),T("div",{key:o,class:"px-1 py-1"},[(u(!0),T(G,null,V(f,n=>(u(),w(s(kt),{key:n.id},{default:R(({active:r})=>[v("button",{class:ve([n.label==="Spremi"?"hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:font-bold hover:text-slate-100 dark:hover:text-gray-950":r&&n.label!="Resetiraj"?"bg-gray-300 dark:bg-gray-900":"",e.value.includes(n.label)?"bg-fipu_blue hover:bg-fipu_light_blue dark:hover:bg-fipu_dark_blue font-medium text-gray-950 hover:text-slate-800 dark:hover:text-gray-950":"",n.label==="Resetiraj"?"dark:hover:bg-rose-600 hover:bg-rose-500 hover:font-bold hover:text-slate-100 dark:hover:text-slate-950":"","group flex rounded-md items-center w-full px-1 md:px-2 py-1 md:py-2 text-sm my-1 transition-all gap-2 md:gap-3"]),disabled:n.label==="Spremi",onClick:vt(i=>n.label==="Spremi"?S():n.label==="Resetiraj"?b():m(n),["prevent"])},[y(Se,{path:n.icon,class:""},null,8,["path"]),v("div",Bt,P(_(n.label)),1)],10,Pt)]),_:2},1024))),128))]))),128))]),_:1},8,["class"])]),_:1})]),_:1}))}},X={default:{primary:"#00D1B2",info:"#209CEE",danger:"#FF3860"}},Ot=a=>{const d=[];for(let g=0;g<a;g++)d.push(Math.round(Math.random()*200));return d},ee=(a,d)=>({fill:!1,borderColor:X.default[a],borderWidth:2,borderDash:[],borderDashOffset:0,pointBackgroundColor:X.default[a],pointBorderColor:"rgba(255,255,255,0)",pointHoverBackgroundColor:X.default[a],pointBorderWidth:20,pointHoverRadius:4,pointHoverBorderWidth:15,pointRadius:4,data:Ot(d),tension:.5,cubicInterpolationMode:"default"}),Nt=(a=12)=>({labels:["Sije\u010Danj","Velja\u010Da","O\u017Eujak","Travanj","Svibanj","Lipanj","Srpanj","Kolovoz","Rujan","Listopad","Studeni","Prosinac"].slice(0,a),datasets:[ee("primary",a),ee("info",a),ee("danger",a)]}),Lt=j.events.map(a=>({id:a.activity_id,label:a.activity_id,icon:a.icon})),Gt=[Lt,[{label:"Spremi"},{label:"Resetiraj"}]],Vt={class:"grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6"},zt={class:"grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6"},qt={key:0,class:"flex flex-wrap md:flex-row"},Ht={class:"mb-4"},Ut={class:"flex flex-row"},Jt={class:"mb-4"},Kt={class:"flex flex-row"},Wt={class:"mb-4"},Yt={key:1,class:"grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"},Qt={class:"flex flex-col"},Zt={class:"flex flex-col"},Xt={key:2,class:"grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"},ea={class:"flex flex-col"},ta={class:"flex flex-col"},aa={key:3,class:"text-red-500 mb-6"},la={key:4,class:"p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"},xa={__name:"DashboardView",setup(a){const d=we(),g=k(0),h=k(0),e=k(0),S=k(0),_=k(0);let b=k([]),m=k(!1);K(async()=>{try{await p.getStudents(),await p.searchModels(),g.value=p.dashboard_data.ongoing_internships,h.value=p.dashboard_data.waiting_for_allocation,e.value=p.dashboard_data.waiting_for_evaluation,S.value=p.dashboard_data.waiting_for_mark,_.value=p.dashboard_data.finished_internships;let C=await p.getEvents();C===null?(m.value=!0,te.pushMessage("Nakon vi\u0161e ponovljenih poku\u0161aja, nije mogu\u0107e dohvatiti evente.","danger")):b.value=C.filter(A=>!j.shouldSkipEvent(A.activity_id)).reverse()}catch(C){console.error("Dashboard rendering error:",C)}});const l=()=>{p.filterActiveInstances=!p.filterActiveInstances},t=x(()=>{if(!p.filterActiveInstances){const C=b.value.filter(c=>c.activity_id==="end_event_student").map(c=>c.instance_id);return b.value.filter(c=>!C.includes(c.instance_id))}return b.value});pe(t,()=>{r.value=0});const f=k(!1),o=C=>p.relativeToNowTimestmap==!0?de(C).fromNow():de(C).format("DD/MM/YYYY u HH:mm"),n=k(10),r=k(0),i=x(()=>t.value.slice(n.value*r.value,n.value*(r.value+1))),M=x(()=>i.value.slice(0,5)),D=x(()=>i.value.slice(5,10)),z=x(()=>Math.ceil(b.value.length/n.value)),_e=x(()=>r.value+1),he=x(()=>{const C=[];for(let A=0;A<z.value;A++)C.push(A);return C}),be=()=>{p.relativeToNowTimestmap=!p.relativeToNowTimestmap},le=Ie(),se=x(()=>le.isLg),ne=x(()=>le.isMd);pe([se,ne],()=>{ie()});const ye=k(null),ie=()=>{se.value||ne.value,ye.value=Nt(12)};return K(()=>{ie()}),(C,A)=>(u(),T("div",null,[s(Me).userAuthenticated?(u(),w(pt,{key:0},{default:R(()=>[y(st,null,{default:R(()=>[y(ce,{icon:s(Ue),title:"Nadzorna plo\u010Da",main:""},null,8,["icon"]),v("div",Vt,[s(p).studentsFetched?(u(),w(B,{key:0,color:"text-fipu_blue",class:"rounded-lg",icon:s(Je),number:_.value,label:"Uspje\u0161no odra\u0111enih praksi"},null,8,["icon","number"])):(u(),w(F,{key:1})),s(p).studentsFetched?(u(),w(B,{key:2,color:"text-fipu_blue",class:"rounded-lg",icon:s(ue),number:g.value,label:"Trenutno aktivnih praksi"},null,8,["icon","number"])):(u(),w(F,{key:3})),s(p).studentsFetched?(u(),w(B,{key:4,color:"text-fipu_blue",class:"rounded-lg",icon:s(Ke),number:h.value,label:"\u010Ceka na alokaciju"},null,8,["icon","number"])):(u(),w(F,{key:5}))]),v("div",zt,[s(p).studentsFetched?(u(),w(B,{key:0,color:"text-fipu_blue",class:"rounded-lg",icon:s(We),number:e.value,label:"U procesu evaluacije"},null,8,["icon","number"])):(u(),w(F,{key:1})),s(p).studentsFetched?(u(),w(B,{key:2,color:"text-fipu_blue",class:"rounded-lg",icon:s(Ye),number:0,label:"Odustali od prakse"},null,8,["icon"])):(u(),w(F,{key:3})),s(p).studentsFetched?(u(),w(B,{key:4,color:"text-fipu_blue",class:"rounded-lg",icon:s(Qe),number:S.value,label:"\u010Ceka na upis ocjene"},null,8,["icon","number"])):(u(),w(F,{key:5}))]),y(ce,{icon:s(Ze),title:"Najnoviji doga\u0111aji",main:"",onClick:A[0]||(A[0]=c=>f.value=!0)},null,8,["icon"]),s(m)?Z("",!0):(u(),T("div",qt,[v("div",Ht,[y(Ft,{class:"cursor-pointer","trend-type":"filter",trend:"Doga\u0111aji",options:s(Gt),left:!0},null,8,["options"])]),v("div",Ut,[v("div",Jt,[y(J,{class:"cursor-pointer",left:!1,icon:s(p).relativeToNowTimestmap?s(Xe):s(et),color:s(p).relativeToNowTimestmap?"info":"success",label:s(p).relativeToNowTimestmap?"Relativno vrijeme":"Datum",onClick:be},null,8,["icon","color","label"])])]),v("div",Kt,[v("div",Wt,[y(J,{class:"cursor-pointer",left:!1,icon:s(p).filterActiveInstances?s(tt):s(ue),color:s(p).filterActiveInstances?"info":"success",label:s(p).filterActiveInstances?"Sve instance":"Samo aktivne",onClick:l},null,8,["icon","color","label"])])])])),!s(m)&&!s(L).isArrayEmpty(s(b))?(u(),T("div",Yt,[v("div",Qt,[(u(!0),T(G,null,V(M.value,(c,q)=>(u(),w(me,{key:"left-"+q,student:c.student_ime+" "+c.student_prezime,date:o(c.timestamp),type:c.activity_id,jmbag:c.student_JMBAG==null?"Gre\u0161ka u dohvatu podataka - JMBAG":c.student_JMBAG,email:c.student_email==null?"Gre\u0161ka u dohvatu podataka - email":c.student_email,class:"rounded-lg cursor-pointer",onClick:ke=>s(d).push(`/studenti/${c.instance_id}`)},null,8,["student","date","type","jmbag","email","onClick"]))),128))]),v("div",Zt,[(u(!0),T(G,null,V(D.value,(c,q)=>(u(),w(me,{key:"right-"+q,student:c.student_ime+" "+c.student_prezime,date:o(c.timestamp),type:c.activity_id,jmbag:c.student_JMBAG==null?"Gre\u0161ka u dohvatu podataka - JMBAG":c.student_JMBAG,email:c.student_email==null?"Gre\u0161ka u dohvatu podataka - email":c.student_email,class:"rounded-lg cursor-pointer",onClick:ke=>s(d).push(`/studenti/${c.instance_id}`)},null,8,["student","date","type","jmbag","email","onClick"]))),128))])])):!s(m)&&s(L).isArrayEmpty(s(b))?(u(),T("div",Xt,[v("div",ea,[y(O),y(O),y(O)]),v("div",ta,[y(O),y(O),y(O)])])):(u(),T("div",aa,"Nakon vi\u0161e ponovljenih poku\u0161aja, nije mogu\u0107e dohvatiti evente.")),s(m)?Z("",!0):(u(),T("div",la,[y(H,null,{default:R(()=>[y(mt,null,{default:R(()=>[(u(!0),T(G,null,V(he.value,c=>(u(),w(at,{key:c,active:c===r.value,label:c+1,color:c===r.value?"lightDark":"whiteDark",small:"",onClick:q=>r.value=c},null,8,["active","label","color","onClick"]))),128))]),_:1}),v("small",null,"Stranica "+P(_e.value)+" od "+P(z.value),1)]),_:1})]))]),_:1})]),_:1})):Z("",!0)]))}};export{xa as default};
