import{u as le,m as P,_ as te,U as Y,s as H,a as T,r as re,d as ue,n as de}from"./index.943c32fd.js";import{_ as W,ae as Z,c as N,af as ve,ag as me,u as ce,l as be}from"./BaseButton.028cc894.js";import{_ as ee,a as fe}from"./SectionTitleLineWithButton.84ca72c6.js";import{_ as G}from"./CardBox.74d9f813.js";import{_ as I,C as pe,a as _e}from"./LayoutAuthenticated.6783f5cf.js";import{L as ke,_ as J}from"./LoadingOverlay.9dbae0c6.js";import{_ as E}from"./BaseButtons.e0ebdabe.js";import{r as p,f as k,w as K,q as Q,x as n,y as i,F as o,z as e,u as r,H as U,M as q,G as A,K as j,A as d,J as c,C as oe,a as ge,N as w}from"./vue.f9cfebed.js";import{c as B,r as F,n as ae,u as he,g as S}from"./validators.3759a75c.js";import{C as we}from"./CardBoxComponentEmpty.dd1b0026.js";import{_ as je}from"./FormField.ad787479.js";import"./vendor.15896b3d.js";import"./SnackBar.f82320c3.js";const ze={key:0},Ce={key:1},Ve={key:0},$e={key:1,class:"border-b-0 lg:w-6 before:hidden"},xe={key:2},Me={"data-label":"Naziv"},Be={"data-label":"Web mjesto"},Ne=["href"],Pe={class:"before:hidden lg:w-1 whitespace-nowrap"},Ue={key:1},Ae={key:1,class:"border-b-0 lg:w-6 before:hidden"},Oe={key:2},ye={"data-label":"Naziv"},Ie={"data-label":"Web mjesto"},De=["href"],Le={"data-label":"Direktor"},Fe={"data-label":"Mati\u010Dni broj"},Se={"data-label":"OIB"},Te={"data-label":"Adresa"},We={class:"before:hidden lg:w-1 whitespace-nowrap"},Ee={class:"p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"},qe={__name:"TableCompanies",props:{checkable:Boolean},setup(D){const b=p(5),_=p(0),C=k(()=>x.value.filter(u=>u.OIB&&u.maticni_broj)),z=k(()=>C.value.slice(b.value*_.value,b.value*(_.value+1))),V=k(()=>Math.ceil(C.value.length/b.value)),t=k(()=>_.value+1),$=k(()=>{const u=[];for(let v=0;v<V.value;v++)u.push(v);return u}),x=p([]);let L=p("");const h=le();async function R(){const u=h.params.naziv;let v=await P.fetchCompanies();x.value=v.data.results,u&&(L.value=u,_.value=g(u))}function g(u){const v=x.value.findIndex(s=>s.naziv===u);return v===-1?0:Math.floor(v/b.value)}K(()=>h.params.naziv,R,{immediate:!0}),Q(async()=>{let u=await P.fetchCompanies();x.value=u.data.results});const M=u=>{window.open(u,"_blank")};return(u,v)=>(n(),i(U,null,[o(ke,{"is-active":!x.value.length,title:"U\u010Ditavanje...",description:"Mo\u017Ee potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."},null,8,["is-active"]),e("table",null,[e("thead",null,[r(P).userAdmin?(n(),i("tr",Ce,v[1]||(v[1]=[e("th",null,null,-1),e("th",null,"Naziv",-1),e("th",null,"Web mjesto",-1),e("th",null,"Direktor",-1),e("th",null,"Mati\u010Dni broj",-1),e("th",null,"OIB",-1),e("th",null,"Adresa",-1),e("th",null,null,-1)]))):(n(),i("tr",ze,v[0]||(v[0]=[e("th",null,null,-1),e("th",null,"Naziv",-1),e("th",null,"Web mjesto",-1),e("th",null,null,-1)])))]),r(P).userAdmin?(n(),i("tbody",Ue,[(n(!0),i(U,null,q(z.value,s=>(n(),i("tr",{key:s.naziv,class:oe({"selected-row":r(L)===s.naziv})},[D.checkable?(n(),A(J,{key:0,"assignment-data":s},null,8,["assignment-data"])):j("",!0),s.logo[0]?(n(),i("td",Ae,[o(I,{avatar:s.logo[0].url,class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"},null,8,["avatar"])])):(n(),i("td",Oe,[o(I,{avatar:"No-Logo.png",class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"})])),e("td",ye,d(s.naziv),1),e("td",Ie,[e("a",{class:"underline",href:s.web,target:"_blank"},d(s.web),9,De)]),e("td",Le,d(s.direktor),1),e("td",Fe,d(s.maticni_broj),1),e("td",Se,d(s.OIB),1),e("td",Te,d(s.adresa),1),e("td",We,[o(E,{type:"justify-start lg:justify-end","no-wrap":""},{default:c(()=>[o(W,{color:"fipu_blue",icon:r(Z),small:"",onClick:O=>M(s.web)},null,8,["icon","onClick"])]),_:2},1024)])],2))),128))])):(n(),i("tbody",Ve,[(n(!0),i(U,null,q(z.value,s=>(n(),i("tr",{key:s.naziv},[D.checkable?(n(),A(J,{key:0,"assignment-data":s},null,8,["assignment-data"])):j("",!0),s.logo[0]?(n(),i("td",$e,[o(I,{avatar:s.logo[0].url,class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"},null,8,["avatar"])])):(n(),i("td",xe,[o(I,{avatar:"No-Logo.png",class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"})])),e("td",Me,d(s.naziv),1),e("td",Be,[e("a",{class:"underline",href:s.web,target:"_blank"},d(s.web),9,Ne)]),e("td",Pe,[o(E,{type:"justify-start lg:justify-end","no-wrap":""},{default:c(()=>[o(W,{color:"fipu_blue",icon:r(Z),small:"",onClick:O=>M(s.web)},null,8,["icon","onClick"])]),_:2},1024)])]))),128))]))]),e("div",Ee,[o(te,null,{default:c(()=>[o(E,null,{default:c(()=>[(n(!0),i(U,null,q($.value,s=>(n(),A(W,{key:s,active:s===_.value,label:s+1,color:s===_.value?"lightDark":"whiteDark",small:"",onClick:O=>_.value=s},null,8,["active","label","color","onClick"]))),128))]),_:1}),e("small",null,"Stranica "+d(t.value)+" od "+d(V.value),1)]),_:1})])],64))}},Re={key:0},He={key:1,class:"border-b-0 lg:w-6 before:hidden"},Ge={key:2},Je={"data-label":"Naziv"},Ke={"data-label":"Web mjesto"},Qe={"data-label":"Direktor"},Xe={"data-label":"Mati\u010Dni broj"},Ye={"data-label":"OIB"},Ze={"data-label":"Adresa"},ea={class:"before:hidden lg:w-1 whitespace-nowrap"},aa={class:"mb-4"},la={key:0},ta={class:"p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"},oa={__name:"TableNewCompanies",props:{checkable:Boolean},setup(D){const b=p([]),_={web:{required:B.withMessage("Polje je obavezno",F)},direktor:{required:B.withMessage("Polje je obavezno",F)},maticni_broj:{required:B.withMessage("Polje je obavezno",F),numeric:B.withMessage("Polje smije sadr\u017Eavati samo brojeve",ae)},OIB:{required:B.withMessage("Polje je obavezno",F),numeric:B.withMessage("Polje smije sadr\u017Eavati samo brojeve",ae)},adresa:{required:B.withMessage("Polje je obavezno",F)}};let C=p("");const z=le();async function V(){const m=z.params.naziv;m&&(C.value=m)}K(()=>z.params.naziv,V,{immediate:!0});const t=p({});Q(async()=>{const a=(await P.fetchCompanies()).data.results.filter(l=>(l.web===""||l.web===null)&&(l.OIB===""||l.OIB===null)&&(l.adresa===""||l.adresa===null)&&(l.maticni_broj===""||l.maticni_broj===null)&&(l.direktor===""||l.direktor===null));Y.isArrayEmpty(a)?(H.pushMessage("Nema novih poduze\u0107a","info"),T.newCompaniesFound=!1):(H.pushMessage("Prona\u0111ena su nova poduze\u0107a, molimo a\u017Eurirajte podatke","info"),T.newCompaniesFound=!0);for(const l of a)t.value[l.id]={naziv:l.naziv,web:l.web,direktor:l.direktor||"",maticni_broj:l.maticni_broj||"",OIB:l.OIB||"",adresa:l.adresa||""};b.value=a});const $=ge({}),x=k(()=>{const m={};for(const a of b.value)m[a.id]=t.value[a.id];return m}),L=()=>{for(const m of b.value)$[m.id]=_};Q(L),K(b,L);const h=he($,x),R=p(!1),g=p(null),M=p({isActive:!1});function u(m){g.value=m,M.value.isActive=!0}function v(){s(),M.value.isActive=!1}async function s(){if(R.value=!0,!await h.value.$validate()){R.value=!1;return}const a=t.value[g.value];T.saveUpdatedCompany(a)?(H.pushMessage("Podaci su uspje\u0161no a\u017Eurirani","success"),await Y.wait(1),location.reload()):H.pushMessage("Podaci nisu a\u017Eurirani","error")}const O=p(5),y=p(0),se=k(()=>b.value.slice(O.value*y.value,O.value*(y.value+1))),X=k(()=>Math.ceil(b.value.length/O.value)),ne=k(()=>y.value+1),ie=k(()=>{const m=[];for(let a=0;a<X.value;a++)m.push(a);return m});return(m,a)=>(n(),i(U,null,[r(T).newCompaniesFound?(n(),i("table",Re,[a[1]||(a[1]=e("thead",null,[e("tr",null,[e("th"),e("th",null,"Naziv"),e("th",null,"Web mjesto"),e("th",null,"Direktor"),e("th",null,"Mati\u010Dni broj"),e("th",null,"OIB"),e("th",null,"Adresa"),e("th")])],-1)),e("tbody",null,[(n(!0),i(U,null,q(se.value,l=>(n(),i("tr",{key:l.naziv,class:oe({"selected-row":r(C)===l.naziv})},[D.checkable?(n(),A(J,{key:0,"assignment-data":l},null,8,["assignment-data"])):j("",!0),l.logo[0]?(n(),i("td",He,[o(I,{avatar:l.logo[0].url,class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"},null,8,["avatar"])])):(n(),i("td",Ge,[o(I,{avatar:"No-Logo.png",class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"})])),e("td",Je,[o(N,{modelValue:t.value[l.id].naziv,"onUpdate:modelValue":f=>t.value[l.id].naziv=f,readonly:""},null,8,["modelValue","onUpdate:modelValue"])]),e("td",Ke,[o(N,{modelValue:t.value[l.id].web,"onUpdate:modelValue":f=>t.value[l.id].web=f,error:r(S)(r(h),"web")},null,8,["modelValue","onUpdate:modelValue","error"])]),e("td",Qe,[o(N,{modelValue:t.value[l.id].direktor,"onUpdate:modelValue":f=>t.value[l.id].direktor=f,error:r(S)(r(h),"direktor")},null,8,["modelValue","onUpdate:modelValue","error"])]),e("td",Xe,[o(N,{modelValue:t.value[l.id].maticni_broj,"onUpdate:modelValue":f=>t.value[l.id].maticni_broj=f,error:r(S)(r(h),"maticni_broj")},null,8,["modelValue","onUpdate:modelValue","error"])]),e("td",Ye,[o(N,{modelValue:t.value[l.id].OIB,"onUpdate:modelValue":f=>t.value[l.id].OIB=f,error:r(S)(r(h),"OIB")},null,8,["modelValue","onUpdate:modelValue","error"])]),e("td",Ze,[o(N,{modelValue:t.value[l.id].adresa,"onUpdate:modelValue":f=>t.value[l.id].adresa=f,error:r(S)(r(h),"adresa")},null,8,["modelValue","onUpdate:modelValue","error"])]),e("td",ea,[o(E,{type:"justify-start lg:justify-end","no-wrap":""},{default:c(()=>[o(W,{color:"fipu_blue",icon:r(ve),small:"",onClick:f=>u(l.id)},null,8,["icon","onClick"])]),_:2},1024)])],2))),128))])])):j("",!0),o(pe,{modelValue:M.value.isActive,"onUpdate:modelValue":a[0]||(a[0]=l=>M.value.isActive=l),title:"Potvrda akcije","button-label":"A\u017Euriraj","has-cancel":"",onConfirm:v},{default:c(()=>[e("div",aa,[g.value?(n(),i("div",la,[a[2]||(a[2]=e("strong",null,"Naziv:",-1)),w(" "+d(t.value[g.value].naziv),1),a[3]||(a[3]=e("br",null,null,-1)),a[4]||(a[4]=e("strong",null,"Web mjesto:",-1)),w(" "+d(t.value[g.value].web),1),a[5]||(a[5]=e("br",null,null,-1)),a[6]||(a[6]=e("strong",null,"Direktor:",-1)),w(" "+d(t.value[g.value].direktor),1),a[7]||(a[7]=e("br",null,null,-1)),a[8]||(a[8]=e("strong",null,"Mati\u010Dni broj:",-1)),w(" "+d(t.value[g.value].maticni_broj),1),a[9]||(a[9]=e("br",null,null,-1)),a[10]||(a[10]=e("strong",null,"OIB:",-1)),w(" "+d(t.value[g.value].OIB),1),a[11]||(a[11]=e("br",null,null,-1)),a[12]||(a[12]=e("strong",null,"Adresa:",-1)),w(" "+d(t.value[g.value].adresa),1),a[13]||(a[13]=e("br",null,null,-1))])):j("",!0),a[14]||(a[14]=e("br",null,null,-1)),a[15]||(a[15]=e("hr",null,null,-1)),a[16]||(a[16]=w(" Molimo provjerite unos te nakon toga potvrdite. "))])]),_:1},8,["modelValue"]),e("div",ta,[o(te,null,{default:c(()=>[o(E,null,{default:c(()=>[(n(!0),i(U,null,q(ie.value,l=>(n(),A(W,{key:l,active:l===y.value,label:l+1,color:l===y.value?"lightDark":"whiteDark",small:"",onClick:f=>y.value=l},null,8,["active","label","color","onClick"]))),128))]),_:1}),e("small",null,"Stranica "+d(ne.value)+" od "+d(X.value),1)]),_:1})])],64))}},sa={key:0},na={key:1,class:"mb-4"},ia={class:"flex flex-wrap items-center text-sm md:text-base"},wa={__name:"CompaniesView",setup(D){const b=k(()=>P.userAuthenticated),_=k(()=>P.userAdmin),C=de.VITE_FRONTEND_URL,z=p(`${C}/poslodavci/novi-zadatak`);return(V,t)=>(n(),i("div",null,[b.value?(n(),A(_e,{key:0},{default:c(()=>[o(fe,null,{default:c(()=>[_.value?(n(),i("div",sa,[o(ee,{icon:r(me),title:"Novi poslodavci",main:""},null,8,["icon"]),t[2]||(t[2]=e("p",{class:"mb-4"},"U tablici se nalaze poduze\u0107a koja su prijavili zadatke za izvo\u0111enje prakse me\u0111utim jo\u0161 nisu registrirani za provo\u0111enje - potrebno je ru\u010Dno unijeti podatke o poduze\u0107u.",-1)),o(G,{"has-table":""},{default:c(()=>[o(oa)]),_:1}),r(T).newCompaniesFound?j("",!0):(n(),A(G,{key:0},{default:c(()=>[o(we)]),_:1}))])):j("",!0),o(ee,{class:"mt-4",icon:r(ce),title:"Svi poslodavci",main:""},null,8,["icon"]),t[6]||(t[6]=e("p",{class:"mb-4"},"U tablici se nalaze poduze\u0107a koja su registrirana za provo\u0111enje studentske prakse u suradnji s Fakultetom informatike u Puli.",-1)),_.value?j("",!0):(n(),i("div",na,[t[5]||(t[5]=e("p",{class:"text-sm md:text-base mb-2"},"Ukoliko ne mo\u017Eete na\u0107i zadatak koji vam se svi\u0111a, javite se poslodavcu, predstavite se i zamolite ih da ispune zadatak putem poveznice ispod.",-1)),o(je,{class:"md:w-1/2",label:"Forma za prijavu novog zadatka"},{default:c(()=>[o(N,{modelValue:z.value,"onUpdate:modelValue":t[0]||(t[0]=$=>z.value=$),"icon-left":V.mdiClipboardCheck,"icon-right":V.mdiContentCopy,name:"addNewAssignmentLink",readonly:"",copyable:""},null,8,["modelValue","icon-left","icon-right"])]),_:1}),e("p",ia,[t[4]||(t[4]=w(" Nakon \u0161to poslodavac ispuni zadatak, prijavite ga u ")),e("span",{class:"text-fipu_blue cursor-pointer inline-flex items-center md:ml-1 whitespace-normal",onClick:t[1]||(t[1]=$=>r(re).push("/moja-praksa"))},[o(ue,{path:r(be),class:"flex-none align-middle",size:18},null,8,["path"]),t[3]||(t[3]=w(" Moja praksa "))])])])),o(G,{"has-table":""},{default:c(()=>[o(qe)]),_:1})]),_:1})]),_:1})):j("",!0)]))}};export{wa as default};
