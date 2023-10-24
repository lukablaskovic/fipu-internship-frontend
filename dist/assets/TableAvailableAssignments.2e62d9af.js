import{m as f,d as Z,q as J,j as R,g,u as X,a as $,_ as Y}from"./index.8a815c4b.js";import{r as u,f as m,q as U,x as n,y as r,z as t,A as l,u as _,P as z,K as c,G as k,C as A,w as C,F as x,J as w,H as P,M as T}from"./vue.7e7f5872.js";import{_ as F,m as Q}from"./BaseButton.1e728d8c.js";import{C as W,_ as tt}from"./LayoutAuthenticated.90c3e678.js";import{L as et,_ as at}from"./LoadingOverlay.157b2581.js";import{_ as V}from"./BaseButtons.06021fb9.js";const st={class:"relative block overflow-hidden rounded-lg pb-4"},lt=t("span",{class:"absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-fipu_blue to-blue-500"},null,-1),ot={class:"sm:flex sm:justify-between sm:gap-4"},nt={class:"text-lg font-bold sm:text-2xl"},it={class:"text-lg font-bold sm:text-xl"},dt={class:"mt-1 text-xs font-medium text-gray-600 dark:text-gray-200"},rt={class:"hidden sm:block sm:shrink-0"},ct=["src"],ut={class:"max-w-[40ch] text-sm text-gray-500 dark:text-gray-300"},_t={class:"mt-4"},mt={class:"max-w-[40ch] text-sm text-gray-500 dark:text-gray-300"},ht=t("b",null,"Potrebno imati:",-1),vt={class:"max-w-[40ch] text-sm text-gray-500 dark:text-gray-300"},gt=t("b",null,"Preferencije za studenta:",-1),xt={class:"max-w-[40ch] text-sm text-gray-500 dark:text-gray-300"},ft=t("b",null,"Napomena:",-1),pt={class:"mt-6 flex gap-4 sm:gap-6"},bt={class:"flex flex-col-reverse"},kt=t("dt",{class:"text-sm font-medium text-gray-600 dark:text-gray-200"},"Okviran po\u010Detak",-1),yt={class:"text-xs text-gray-500 dark:text-gray-100"},jt={class:"flex flex-col-reverse"},$t=t("dt",{class:"text-sm font-medium text-gray-600 dark:text-gray-200"},"Lokacija",-1),wt={class:"text-xs text-gray-500 dark:text-gray-100"},At={class:"flex flex-col-reverse"},zt=t("dt",{class:"text-sm font-medium text-gray-600 dark:text-gray-200"},"Trajanje",-1),Ct={class:"text-xs text-gray-500 dark:text-gray-100"},Pt={key:0,class:"flex flex-col-reverse"},St=t("dt",{class:"text-sm font-medium text-gray-600 dark:text-gray-200"},"Selekcija",-1),Lt={class:"text-xs text-gray-500 dark:text-gray-100"},Mt={key:1,class:"flex flex-col-reverse"},Bt=t("dt",{class:"text-sm font-medium text-gray-600 dark:text-gray-200"},"FIPU Anga\u017Eman",-1),Nt={class:"text-xs text-gray-500 dark:text-gray-100"},Dt={__name:"CardBoxAllocation",props:{data:{type:Object,required:!0}},setup(i){const s=i;let d=u("");const y=m(()=>s.data.opis_zadatka.length>50?s.data.opis_zadatka.substring(0,50)+"...":s.data.opis_zadatka);return U(async()=>{let p=await f.fetchCompanies(s.data.Poslodavac[0].value);d.value=p.data.results[0].logo[0].url}),(p,S)=>(n(),r("div",st,[lt,t("div",ot,[t("div",null,[t("h1",nt,l(s.data.id_zadatak),1),t("h3",it,l(y.value),1),t("p",dt,l(s.data.Poslodavac[0].value)+": "+l(s.data.poslodavac_email),1)]),t("div",rt,[t("img",{alt:"logo",src:_(d),class:"h-24 w-24 object-cover shadow-sm rounded-full block max-w-full bg-gray-100 dark:bg-slate-800"},null,8,ct)])]),t("div",null,[t("p",ut,l(s.data.opis_zadatka),1)]),t("div",_t,[t("p",mt,[ht,z(" "+l(s.data.potrebno_imati),1)]),t("p",vt,[gt,z(" "+l(s.data.preferencije_za_studenta),1)]),t("p",xt,[ft,z(" "+l(s.data.napomena||"Nema napomene."),1)])]),t("dl",pt,[t("div",bt,[kt,t("dd",yt,l(s.data.zeljeno_okvirno_vrijeme_pocetka),1)]),t("div",jt,[$t,t("dd",wt,l(s.data.lokacija),1)]),t("div",At,[zt,t("dd",Ct,l(s.data.trajanje_sati)+" sati",1)]),s.data.selekcija===!0?(n(),r("div",Pt,[St,t("dd",Lt,l(s.data.proces_selekcije),1)])):c("",!0),s.data.angazman_fipu!=="Ne"||s.data.angazman_fipu===""?(n(),r("div",Mt,[Bt,t("dd",Nt,l(s.data.angazman_fipu),1)])):c("",!0)])]))}},Tt={class:"drop-shadow truncate whitespace-nowrap text-center max-w-[128px]"},Ft=["title"],Vt={__name:"PillTagPlain",props:{label:{type:String,required:!0},icon:{type:String,default:null},small:Boolean},setup(i){return(s,d)=>(n(),r("div",{class:A(["inline-flex items-center capitalize hover:bg-opacity-80",[i.small?"text-xs hover:bg":"text-sm  py-0.5 px-3 sm:px-3"]])},[i.icon?(n(),k(Z,{key:0,path:i.icon,h:"h-4",w:"w-4",class:A(i.small?"mr-1":"mr-2"),size:i.small?14:null},null,8,["path","class","size"])):c("",!0),t("span",Tt,[t("abbr",{class:"no-underline",title:i.label},l(i.label),9,Ft)])],2))}},me={__name:"PillTag",props:{label:{type:String,required:!0},color:{type:String,required:!0},icon:{type:String,default:null},small:Boolean,outline:Boolean},setup(i){const s=i,d=m(()=>[s.small?"py-1 px-3":"py-0.5 px-4 m-1",s.outline?J[s.color]:R[s.color]]);return(y,p)=>(n(),k(Vt,{class:A(["border rounded-full",d.value]),icon:i.icon,label:i.label,small:i.small},null,8,["class","icon","label","small"]))}},qt=t("br",null,null,-1),Ut={key:0},Et=t("th",null,null,-1),It=t("th",null,"ID Zadatka",-1),Ot=t("th",null,"Kontakt email",-1),Kt=t("th",null,"Preferirane tehnologije",-1),Gt=t("th",null,"Trajanje (sati)",-1),Ht=t("th",null,"Lokacija",-1),Zt={key:1},Jt={key:2},Rt=t("th",null,null,-1),Xt={class:"border-b-0 lg:w-6 before:hidden"},Yt={"data-label":"id_zadatak"},Qt={"data-label":"Kontakt email"},Wt={"data-label":"Preferirane tehnologije"},te={"data-label":"Trajanje (sati)"},ee={"data-label":"Lokacija"},ae={key:1,"data-label":"Max. studenata"},se={key:2,"data-label":"Dostupno mjesta"},le={class:"before:hidden lg:w-1 whitespace-nowrap"},oe={class:"p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"},q=3,he={__name:"TableAvailableAssignments",props:{checkable:Boolean},setup(i){const s=u(5),d=u(0),y=m(()=>h.value.slice(s.value*d.value,s.value*(d.value+1))),p=m(()=>Math.ceil(h.value.length/s.value)),S=m(()=>d.value+1),E=m(()=>{const o=[];for(let e=0;e<p.value;e++)o.push(e);return o}),b=u(null),h=u([]),L=u([]);let j=m(()=>g.checkedAssignments),M=u("");const B=X();async function I(){const o=B.params.id_zadatak,e=await g.fetchAvailableAssignments();h.value=e.filter(v=>($.availableAssignmentsFilter?v.dostupno_mjesta>0:v.dostupno_mjesta>=0)&&v.voditelj_odobrio.value=="odobreno"),o&&(M.value=o,d.value=K(o));let a=await f.fetchCompanies();L.value=a.data.results}C(()=>B.params.id_zadatak,I,{immediate:!0}),U(async()=>{const o=await g.fetchAvailableAssignments();h.value=o.filter(e=>($.availableAssignmentsFilter?e.dostupno_mjesta>0:e.dostupno_mjesta>=0)&&e.voditelj_odobrio.value=="odobreno"),g.resetAssignments()});const O=o=>{const e=L.value.find(a=>a.naziv===o.Poslodavac[0].value);return e&&e.logo&&e.logo[0]&&e.logo[0].url?e.logo[0].url:"No-Logo.png"};function K(o){const e=h.value.findIndex(a=>a.id_zadatak===o);return e===-1?0:Math.floor(e/s.value)}const N=u({}),G=m(()=>j.value.length>=q);C(j,o=>{o.forEach(e=>{N.value[e.id_zadatak]=!1})}),C(()=>$.availableAssignmentsFilter,async()=>{const o=await g.fetchAvailableAssignments();h.value=o.filter(e=>($.availableAssignmentsFilter?e.dostupno_mjesta>0:e.dostupno_mjesta>=0)&&e.voditelj_odobrio.value=="odobreno")},{immediate:!0});const D=o=>j.value.some(e=>e.id_zadatak===o.id_zadatak),H=(o,e)=>{if(o){if(j.value.length>=q){alert("You can only select a maximum of 3 assignments."),N[e.id_zadatak]=!1;return}g.addAssignment(e)}else g.removeAssignment(e)};return(o,e)=>(n(),r(P,null,[x(et,{"is-active":!h.value.length,title:"U\u010Ditavanje...",description:"Mo\u017Ee potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."},null,8,["is-active"]),b.value?(n(),k(W,{key:0,modelValue:b.value,"onUpdate:modelValue":e[0]||(e[0]=a=>b.value=a),"button-label":"Zatvori",button:"fipu_blue","has-cancel:false":"",onCancel:e[1]||(e[1]=a=>_(f).activateLogoutModal(!1))},{default:w(()=>[x(Dt,{data:b.value},null,8,["data"]),qt]),_:1},8,["modelValue"])):c("",!0),t("table",null,[t("thead",null,[t("tr",null,[i.checkable?(n(),r("th",Ut)):c("",!0),Et,It,Ot,Kt,Gt,Ht,_(f).userAdmin?(n(),r("th",Zt,"Max. mjesta")):c("",!0),_(f).userAdmin?(n(),r("th",Jt,"Dostupno mjesta")):c("",!0),Rt])]),t("tbody",null,[(n(!0),r(P,null,T(y.value,a=>(n(),r("tr",{key:a.id_zadatak,class:A({"selected-row":_(M)===a.id_zadatak})},[i.checkable?(n(),k(at,{key:0,value:D(a),disabled:G.value&&!D(a),onChecked:v=>H(v,a)},null,8,["value","disabled","onChecked"])):c("",!0),t("td",Xt,[x(tt,{avatar:O(a),class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"},null,8,["avatar"])]),t("td",Yt,l(a.id_zadatak),1),t("td",Qt,l(a.poslodavac_email),1),t("td",Wt,l(a.preferirane_tehnologije),1),t("td",te,l(a.trajanje_sati),1),t("td",ee,l(a.lokacija),1),_(f).userAdmin?(n(),r("td",ae,l(a.broj_studenata),1)):c("",!0),_(f).userAdmin?(n(),r("td",se,l(a.dostupno_mjesta),1)):c("",!0),t("td",le,[x(V,{type:"justify-start lg:justify-end","no-wrap":""},{default:w(()=>[x(F,{color:"fipu_blue",icon:_(Q),small:"",onClick:v=>b.value=a},null,8,["icon","onClick"])]),_:2},1024)])],2))),128))])]),t("div",oe,[x(Y,null,{default:w(()=>[x(V,null,{default:w(()=>[(n(!0),r(P,null,T(E.value,a=>(n(),k(F,{key:a,active:a===d.value,label:a+1,color:a===d.value?"lightDark":"whiteDark",small:"",onClick:v=>d.value=a},null,8,["active","label","color","onClick"]))),128))]),_:1}),t("small",null,"Stranica "+l(S.value)+" od "+l(p.value),1)]),_:1})])],64))}};export{Dt as _,me as a,he as b,Vt as c};