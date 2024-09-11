import{u as le,m as N,_ as te,U as Y,s as H,a as T,r as re,d as ue}from"./index.86b5d783.js";import{_ as W,ae as Z,c as B,af as de,ag as ve,u as me,l as ce}from"./BaseButton.ad2b7e80.js";import{_ as ee,a as be}from"./SectionTitleLineWithButton.e6d58529.js";import{_ as G}from"./CardBox.56f4d2a6.js";import{_ as I,C as fe,a as pe}from"./LayoutAuthenticated.ac77a7c5.js";import{L as _e,_ as J}from"./LoadingOverlay.e4109df3.js";import{_ as E}from"./BaseButtons.e0ebdabe.js";import{r as p,f as k,w as K,q as Q,x as n,y as i,F as o,z as e,u as r,H as P,M as q,G as U,K as j,A as d,J as c,C as oe,a as ke,N as w}from"./vue.f9cfebed.js";import{c as M,r as F,n as ae,u as ge,g as S}from"./validators.3759a75c.js";import{C as he}from"./CardBoxComponentEmpty.bd159abb.js";import{_ as we}from"./FormField.a7f5c3df.js";import"./vendor.15896b3d.js";import"./SnackBar.52218b07.js";const je={key:0},ze={key:1},Ce={key:0},Ve={key:1,class:"border-b-0 lg:w-6 before:hidden"},$e={key:2},xe={"data-label":"Naziv"},Me={"data-label":"Web mjesto"},Be=["href"],Ne={class:"before:hidden lg:w-1 whitespace-nowrap"},Pe={key:1},Ue={key:1,class:"border-b-0 lg:w-6 before:hidden"},Ae={key:2},Oe={"data-label":"Naziv"},ye={"data-label":"Web mjesto"},Ie=["href"],De={"data-label":"Direktor"},Le={"data-label":"Mati\u010Dni broj"},Fe={"data-label":"OIB"},Se={"data-label":"Adresa"},Te={class:"before:hidden lg:w-1 whitespace-nowrap"},We={class:"p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"},Ee={__name:"TableCompanies",props:{checkable:Boolean},setup(D){const b=p(5),_=p(0),A=k(()=>$.value.filter(u=>u.OIB&&u.maticni_broj)),z=k(()=>A.value.slice(b.value*_.value,b.value*(_.value+1))),C=k(()=>Math.ceil(A.value.length/b.value)),t=k(()=>_.value+1),V=k(()=>{const u=[];for(let v=0;v<C.value;v++)u.push(v);return u}),$=p([]);let L=p("");const h=le();async function R(){const u=h.params.naziv;let v=await N.fetchCompanies();$.value=v.data.results,u&&(L.value=u,_.value=g(u))}function g(u){const v=$.value.findIndex(s=>s.naziv===u);return v===-1?0:Math.floor(v/b.value)}K(()=>h.params.naziv,R,{immediate:!0}),Q(async()=>{let u=await N.fetchCompanies();$.value=u.data.results});const x=u=>{window.open(u,"_blank")};return(u,v)=>(n(),i(P,null,[o(_e,{"is-active":!$.value.length,title:"U\u010Ditavanje...",description:"Mo\u017Ee potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."},null,8,["is-active"]),e("table",null,[e("thead",null,[r(N).userAdmin?(n(),i("tr",ze,v[1]||(v[1]=[e("th",null,null,-1),e("th",null,"Naziv",-1),e("th",null,"Web mjesto",-1),e("th",null,"Direktor",-1),e("th",null,"Mati\u010Dni broj",-1),e("th",null,"OIB",-1),e("th",null,"Adresa",-1),e("th",null,null,-1)]))):(n(),i("tr",je,v[0]||(v[0]=[e("th",null,null,-1),e("th",null,"Naziv",-1),e("th",null,"Web mjesto",-1),e("th",null,null,-1)])))]),r(N).userAdmin?(n(),i("tbody",Pe,[(n(!0),i(P,null,q(z.value,s=>(n(),i("tr",{key:s.naziv,class:oe({"selected-row":r(L)===s.naziv})},[D.checkable?(n(),U(J,{key:0,"assignment-data":s},null,8,["assignment-data"])):j("",!0),s.logo[0]?(n(),i("td",Ue,[o(I,{avatar:s.logo[0].url,class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"},null,8,["avatar"])])):(n(),i("td",Ae,[o(I,{avatar:"No-Logo.png",class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"})])),e("td",Oe,d(s.naziv),1),e("td",ye,[e("a",{class:"underline",href:s.web,target:"_blank"},d(s.web),9,Ie)]),e("td",De,d(s.direktor),1),e("td",Le,d(s.maticni_broj),1),e("td",Fe,d(s.OIB),1),e("td",Se,d(s.adresa),1),e("td",Te,[o(E,{type:"justify-start lg:justify-end","no-wrap":""},{default:c(()=>[o(W,{color:"fipu_blue",icon:r(Z),small:"",onClick:O=>x(s.web)},null,8,["icon","onClick"])]),_:2},1024)])],2))),128))])):(n(),i("tbody",Ce,[(n(!0),i(P,null,q(z.value,s=>(n(),i("tr",{key:s.naziv},[D.checkable?(n(),U(J,{key:0,"assignment-data":s},null,8,["assignment-data"])):j("",!0),s.logo[0]?(n(),i("td",Ve,[o(I,{avatar:s.logo[0].url,class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"},null,8,["avatar"])])):(n(),i("td",$e,[o(I,{avatar:"No-Logo.png",class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"})])),e("td",xe,d(s.naziv),1),e("td",Me,[e("a",{class:"underline",href:s.web,target:"_blank"},d(s.web),9,Be)]),e("td",Ne,[o(E,{type:"justify-start lg:justify-end","no-wrap":""},{default:c(()=>[o(W,{color:"fipu_blue",icon:r(Z),small:"",onClick:O=>x(s.web)},null,8,["icon","onClick"])]),_:2},1024)])]))),128))]))]),e("div",We,[o(te,null,{default:c(()=>[o(E,null,{default:c(()=>[(n(!0),i(P,null,q(V.value,s=>(n(),U(W,{key:s,active:s===_.value,label:s+1,color:s===_.value?"lightDark":"whiteDark",small:"",onClick:O=>_.value=s},null,8,["active","label","color","onClick"]))),128))]),_:1}),e("small",null,"Stranica "+d(t.value)+" od "+d(C.value),1)]),_:1})])],64))}},qe={key:0},Re={key:1,class:"border-b-0 lg:w-6 before:hidden"},He={key:2},Ge={"data-label":"Naziv"},Je={"data-label":"Web mjesto"},Ke={"data-label":"Direktor"},Qe={"data-label":"Mati\u010Dni broj"},Xe={"data-label":"OIB"},Ye={"data-label":"Adresa"},Ze={class:"before:hidden lg:w-1 whitespace-nowrap"},ea={class:"mb-4"},aa={key:0},la={class:"p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"},ta={__name:"TableNewCompanies",props:{checkable:Boolean},setup(D){const b=p([]),_={web:{required:M.withMessage("Polje je obavezno",F)},direktor:{required:M.withMessage("Polje je obavezno",F)},maticni_broj:{required:M.withMessage("Polje je obavezno",F),numeric:M.withMessage("Polje smije sadr\u017Eavati samo brojeve",ae)},OIB:{required:M.withMessage("Polje je obavezno",F),numeric:M.withMessage("Polje smije sadr\u017Eavati samo brojeve",ae)},adresa:{required:M.withMessage("Polje je obavezno",F)}};let A=p("");const z=le();async function C(){const m=z.params.naziv;m&&(A.value=m)}K(()=>z.params.naziv,C,{immediate:!0});const t=p({});Q(async()=>{const a=(await N.fetchCompanies()).data.results.filter(l=>(l.web===""||l.web===null)&&(l.OIB===""||l.OIB===null)&&(l.adresa===""||l.adresa===null)&&(l.maticni_broj===""||l.maticni_broj===null)&&(l.direktor===""||l.direktor===null));Y.isArrayEmpty(a)?(H.pushMessage("Nema novih poduze\u0107a","info"),T.newCompaniesFound=!1):(H.pushMessage("Prona\u0111ena su nova poduze\u0107a, molimo a\u017Eurirajte podatke","info"),T.newCompaniesFound=!0);for(const l of a)t.value[l.id]={naziv:l.naziv,web:l.web,direktor:l.direktor||"",maticni_broj:l.maticni_broj||"",OIB:l.OIB||"",adresa:l.adresa||""};b.value=a});const V=ke({}),$=k(()=>{const m={};for(const a of b.value)m[a.id]=t.value[a.id];return m}),L=()=>{for(const m of b.value)V[m.id]=_};Q(L),K(b,L);const h=ge(V,$),R=p(!1),g=p(null),x=p({isActive:!1});function u(m){g.value=m,x.value.isActive=!0}function v(){s(),x.value.isActive=!1}async function s(){if(R.value=!0,!await h.value.$validate()){R.value=!1;return}const a=t.value[g.value];T.saveUpdatedCompany(a)?(H.pushMessage("Podaci su uspje\u0161no a\u017Eurirani","success"),await Y.wait(1),location.reload()):H.pushMessage("Podaci nisu a\u017Eurirani","error")}const O=p(5),y=p(0),se=k(()=>b.value.slice(O.value*y.value,O.value*(y.value+1))),X=k(()=>Math.ceil(b.value.length/O.value)),ne=k(()=>y.value+1),ie=k(()=>{const m=[];for(let a=0;a<X.value;a++)m.push(a);return m});return(m,a)=>(n(),i(P,null,[r(T).newCompaniesFound?(n(),i("table",qe,[a[1]||(a[1]=e("thead",null,[e("tr",null,[e("th"),e("th",null,"Naziv"),e("th",null,"Web mjesto"),e("th",null,"Direktor"),e("th",null,"Mati\u010Dni broj"),e("th",null,"OIB"),e("th",null,"Adresa"),e("th")])],-1)),e("tbody",null,[(n(!0),i(P,null,q(se.value,l=>(n(),i("tr",{key:l.naziv,class:oe({"selected-row":r(A)===l.naziv})},[D.checkable?(n(),U(J,{key:0,"assignment-data":l},null,8,["assignment-data"])):j("",!0),l.logo[0]?(n(),i("td",Re,[o(I,{avatar:l.logo[0].url,class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"},null,8,["avatar"])])):(n(),i("td",He,[o(I,{avatar:"No-Logo.png",class:"w-24 h-24 mx-auto lg:w-6 lg:h-6"})])),e("td",Ge,[o(B,{modelValue:t.value[l.id].naziv,"onUpdate:modelValue":f=>t.value[l.id].naziv=f,readonly:""},null,8,["modelValue","onUpdate:modelValue"])]),e("td",Je,[o(B,{modelValue:t.value[l.id].web,"onUpdate:modelValue":f=>t.value[l.id].web=f,error:r(S)(r(h),"web")},null,8,["modelValue","onUpdate:modelValue","error"])]),e("td",Ke,[o(B,{modelValue:t.value[l.id].direktor,"onUpdate:modelValue":f=>t.value[l.id].direktor=f,error:r(S)(r(h),"direktor")},null,8,["modelValue","onUpdate:modelValue","error"])]),e("td",Qe,[o(B,{modelValue:t.value[l.id].maticni_broj,"onUpdate:modelValue":f=>t.value[l.id].maticni_broj=f,error:r(S)(r(h),"maticni_broj")},null,8,["modelValue","onUpdate:modelValue","error"])]),e("td",Xe,[o(B,{modelValue:t.value[l.id].OIB,"onUpdate:modelValue":f=>t.value[l.id].OIB=f,error:r(S)(r(h),"OIB")},null,8,["modelValue","onUpdate:modelValue","error"])]),e("td",Ye,[o(B,{modelValue:t.value[l.id].adresa,"onUpdate:modelValue":f=>t.value[l.id].adresa=f,error:r(S)(r(h),"adresa")},null,8,["modelValue","onUpdate:modelValue","error"])]),e("td",Ze,[o(E,{type:"justify-start lg:justify-end","no-wrap":""},{default:c(()=>[o(W,{color:"fipu_blue",icon:r(de),small:"",onClick:f=>u(l.id)},null,8,["icon","onClick"])]),_:2},1024)])],2))),128))])])):j("",!0),o(fe,{modelValue:x.value.isActive,"onUpdate:modelValue":a[0]||(a[0]=l=>x.value.isActive=l),title:"Potvrda akcije","button-label":"A\u017Euriraj","has-cancel":"",onConfirm:v},{default:c(()=>[e("div",ea,[g.value?(n(),i("div",aa,[a[2]||(a[2]=e("strong",null,"Naziv:",-1)),w(" "+d(t.value[g.value].naziv),1),a[3]||(a[3]=e("br",null,null,-1)),a[4]||(a[4]=e("strong",null,"Web mjesto:",-1)),w(" "+d(t.value[g.value].web),1),a[5]||(a[5]=e("br",null,null,-1)),a[6]||(a[6]=e("strong",null,"Direktor:",-1)),w(" "+d(t.value[g.value].direktor),1),a[7]||(a[7]=e("br",null,null,-1)),a[8]||(a[8]=e("strong",null,"Mati\u010Dni broj:",-1)),w(" "+d(t.value[g.value].maticni_broj),1),a[9]||(a[9]=e("br",null,null,-1)),a[10]||(a[10]=e("strong",null,"OIB:",-1)),w(" "+d(t.value[g.value].OIB),1),a[11]||(a[11]=e("br",null,null,-1)),a[12]||(a[12]=e("strong",null,"Adresa:",-1)),w(" "+d(t.value[g.value].adresa),1),a[13]||(a[13]=e("br",null,null,-1))])):j("",!0),a[14]||(a[14]=e("br",null,null,-1)),a[15]||(a[15]=e("hr",null,null,-1)),a[16]||(a[16]=w(" Molimo provjerite unos te nakon toga potvrdite. "))])]),_:1},8,["modelValue"]),e("div",la,[o(te,null,{default:c(()=>[o(E,null,{default:c(()=>[(n(!0),i(P,null,q(ie.value,l=>(n(),U(W,{key:l,active:l===y.value,label:l+1,color:l===y.value?"lightDark":"whiteDark",small:"",onClick:f=>y.value=l},null,8,["active","label","color","onClick"]))),128))]),_:1}),e("small",null,"Stranica "+d(ne.value)+" od "+d(X.value),1)]),_:1})])],64))}},oa={key:0},sa={key:1,class:"mb-4"},na={class:"flex flex-wrap items-center text-sm md:text-base"},ha={__name:"CompaniesView",setup(D){const b=k(()=>N.userAuthenticated),_=k(()=>N.userAdmin),z=p("http://fipubot.unipu.hr:4000/poslodavci/novi-zadatak");return(C,t)=>(n(),i("div",null,[b.value?(n(),U(pe,{key:0},{default:c(()=>[o(be,null,{default:c(()=>[_.value?(n(),i("div",oa,[o(ee,{icon:r(ve),title:"Novi poslodavci",main:""},null,8,["icon"]),t[2]||(t[2]=e("p",{class:"mb-4"},"U tablici se nalaze poduze\u0107a koja su prijavili zadatke za izvo\u0111enje prakse me\u0111utim jo\u0161 nisu registrirani za provo\u0111enje - potrebno je ru\u010Dno unijeti podatke o poduze\u0107u.",-1)),o(G,{"has-table":""},{default:c(()=>[o(ta)]),_:1}),r(T).newCompaniesFound?j("",!0):(n(),U(G,{key:0},{default:c(()=>[o(he)]),_:1}))])):j("",!0),o(ee,{class:"mt-4",icon:r(me),title:"Svi poslodavci",main:""},null,8,["icon"]),t[6]||(t[6]=e("p",{class:"mb-4"},"U tablici se nalaze poduze\u0107a koja su registrirana za provo\u0111enje studentske prakse u suradnji s Fakultetom informatike u Puli.",-1)),_.value?j("",!0):(n(),i("div",sa,[t[5]||(t[5]=e("p",{class:"text-sm md:text-base mb-2"},"Ukoliko ne mo\u017Eete na\u0107i zadatak koji vam se svi\u0111a, javite se poslodavcu, predstavite se i zamolite ih da ispune zadatak putem poveznice ispod.",-1)),o(we,{class:"md:w-1/2",label:"Forma za prijavu novog zadatka"},{default:c(()=>[o(B,{modelValue:z.value,"onUpdate:modelValue":t[0]||(t[0]=V=>z.value=V),"icon-left":C.mdiClipboardCheck,"icon-right":C.mdiContentCopy,name:"addNewAssignmentLink",readonly:"",copyable:""},null,8,["modelValue","icon-left","icon-right"])]),_:1}),e("p",na,[t[4]||(t[4]=w(" Nakon \u0161to poslodavac ispuni zadatak, prijavite ga u ")),e("span",{class:"text-fipu_blue cursor-pointer inline-flex items-center md:ml-1 whitespace-normal",onClick:t[1]||(t[1]=V=>r(re).push("/moja-praksa"))},[o(ue,{path:r(ce),class:"flex-none align-middle",size:18},null,8,["path"]),t[3]||(t[3]=w(" Moja praksa "))])])])),o(G,{"has-table":""},{default:c(()=>[o(Ee)]),_:1})]),_:1})]),_:1})):j("",!0)]))}};export{ha as default};
