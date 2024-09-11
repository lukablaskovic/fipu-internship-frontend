import{f as z,x as A,y as J,I as D,C as O,r as p,a as H,G as K,J as l,_ as Y,F as t,z as r,u as e,O as S,N as V,b as Z,A as P,K as Q,T as W}from"./vue.f9cfebed.js";import{c as s,r as c,a as L,n as X,e as ee,d as ae,i as te,m as oe,h as ie,b as se,s as le,u as re,g as f}from"./validators.3759a75c.js";import{c as g,d as G,aY as ne,A as de,aZ as ue,b7 as R,_ as N,G as me,H as pe,I as ce}from"./BaseButton.028cc894.js";import{h as fe,A as ge,B as ve,b as _e,c as xe,e as y,U as be}from"./index.943c32fd.js";import{_ as q}from"./CardBox.74d9f813.js";import{_ as we}from"./FormCheckRadio.8030a8fa.js";import{_ as v}from"./FormField.ad787479.js";import{_ as he}from"./BaseButtons.e0ebdabe.js";import{S as I}from"./maps.a84fde3c.js";import{f as je}from"./fipu_unipu.dcc21bb0.js";import"./vendor.15896b3d.js";import"./LayoutAuthenticated.6783f5cf.js";import"./SnackBar.f82320c3.js";import"./SectionTitleLineWithButton.84ca72c6.js";import"./TableAvailableAssignments.76b23393.js";import"./LoadingOverlay.9dbae0c6.js";import"./FormFilePicker.20c9096b.js";import"./FormCheckRadioGroup.fc40e1b5.js";const ke={__name:"SectionSplitRegister",props:{bg:{type:String,required:!0,validator:x=>["blue","pinkRed"].includes(x)}},setup(x){const u=x,o=z(()=>{if(fe.darkMode)return ge;switch(u.bg){case"blue":return ve}return""});return(k,B)=>(A(),J("div",{class:O(["md:px-12 transition-all duration-300 flex justify-center",o.value])},[D(k.$slots,"default",{cardClass:"shadow-2xl"})],2))}},Me="/register_art.jpg";const Ve={key:0,class:"flex flex-col justify-center items-center overflow-hidden h-screen md:py-2 xl:py-4 md:px-4 || transition-all duration-300"},ye={class:"flex flex-col md:flex-row flex-shrink h-full rounded-lg overflow-hidden"},ze={class:"flex flex-col md:flex-row flex-shrink h-full || bg-white overflow-y-auto fipu_vertical_scrollbar || transition-all duration-300 px-0 lg:px-6 xl:px-16 2xl:px-28 || xl:gap-4 2xl:gap-8"},Ae=["src"],Be={href:"https://fipu.unipu.hr/",target:"_blank"},Ce=["src"],Ue={class:"md:text-sm lg:text-sm 2xl:text-base mb-2 2xl:mb-4 text-justify"},Se={class:"flex flex-col md:flex-row gap-6 md:gap-2"},Pe={class:"flex flex-col flex-1"},Le={class:"flex flex-col flex-1"},Ge={class:"mt-2 lg:mt-8 flex items-center"},Re={__name:"RegisterView",setup(x){let u=p(!1);const o=H({ime:"",prezime:"",email:"",JMBAG:"",godina_studija:I.GodinaStudijaMappings[0],password:"",passwordConfirm:""}),k=z(()=>o.password),B={ime:{required:s.withMessage("Polje je obavezno",c),croatianAlpha:s.withMessage("Polje smije sadr\u017Eavati samo slova",L)},prezime:{required:s.withMessage("Polje je obavezno",c),croatianAlpha:s.withMessage("Polje smije sadr\u017Eavati samo slova",L)},JMBAG:{required:s.withMessage("Polje je obavezno",c),numeric:s.withMessage("Polje smije sadr\u017Eavati samo brojeve",X),exactLength:s.withMessage("JMBAG mora sadr\u017Eavati to\u010Dno 10 znamenki",ee(10))},godina_studija:{required:s.withMessage("Polje je obavezno",c)},email:{required:s.withMessage("Polje je obavezno",c),email:s.withMessage("Molimo unesite ispravnu e-mail adresu",ae),isUnipuEmail:s.withMessage("Molimo unesite va\u0161u UNIPU e-mail adresu",te)},password:{required:s.withMessage("Polje je obavezno",c),minLength:s.withMessage("Lozinka mora sadr\u017Eavati minimalno 6 znakova",oe(6)),containsAlpha:s.withMessage("Lozinka mora sadr\u017Eavati barem jedno slovo",ie),containsNumeric:s.withMessage("Lozinka mora sadr\u017Eavati barem jedan broj",se)},passwordConfirm:{required:s.withMessage("Polje je obavezno",c),sameAs:s.withMessage("Lozinke se ne podudaraju",le(k))}},d=re(B,o),_=p(!1),C=xe();async function $(){if(_.value=!0,!await d.value.$validate()){_.value=!1;return}let a={...o,godina_studija:o.godina_studija.dbLabel};delete a.passwordConfirm;let m=await y.registerStudent(a);if(_.value=!1,m.response&&m.response.status===400)h("warning");else if(m.response&&m.response.status===500)h("danger");else{let i=await y.createInternshipInstance();if(i.status!==500)await y.update_process_instance(m.data.id,i.id),h("success"),await be.wait(2),C.push("/login");else{h("danger");return}}}const n=p(null);let b=p(),w=p();const E=p([]),M=z(()=>E.value.indexOf("outline")>-1);function h(j){switch(j){case"success":n.value.color="success",n.value.icon=ce,n.value.duration=1,b.value="To je to!",w.value=" Uspje\u0161na registracija!";break;case"warning":n.value.color="warning",n.value.icon=pe,b.value="Upozorenje.",w.value=" Ra\u010Dun s ovim podacima ve\u0107 postoji.";break;case"danger":n.value.color="danger",n.value.icon=me,b.value="Gre\u0161ka!",w.value="Sustav ne radi. Nije do vas, molimo poku\u0161ajte opet ili kontaktirajte voditelja prakse.";break}n.value.show()}const U=p(!1);function F(){U.value=!0}function T(){C.push("/login")}return(j,a)=>{const m=Y("NotificationBar");return A(),K(ke,{bg:"blue",class:"flex items-start min-h-screen"},{default:l(()=>[t(W,{appear:"","enter-active-class":"animate__animated animate__slideInLeft fast-animation","leave-active-class":"animate__animated animate__slideOutLeft fast-animation",onAfterLeave:T},{default:l(()=>[U.value?Q("",!0):(A(),J("div",Ve,[r("div",ye,[r("div",ze,[t(q,{"has-table":"",class:"hidden xl:flex justify-center items-center flex-1 bg-opacity-0 grow p-16 xl:px-0 xl:py-16 2xl:py-24 || transition-all duration-300"},{default:l(()=>[r("img",{src:e(Me),alt:"Register graphics",class:"2xl:pr-8 aspect-square max-h-full"},null,8,Ae)]),_:1}),t(q,{"has-table":"","vertical-centered":"",class:"flex flex-col flex-shrink flex-1 bg-opacity-0 p-8 sm:p-16 xl:pl-2 xl:px-0 xl:py-24 || transition-all duration-300","is-form":"",onSubmit:S($,["prevent"])},{default:l(()=>[r("a",Be,[r("img",{src:e(je),alt:"fipu logo",class:"h-20 xl:h-20 2xl:h-16 ultrawide:h-28 mb-3 2xl:mb-4 object-contain transition-all duration-300"},null,8,Ce)]),a[11]||(a[11]=r("h2",{class:"text-2xl lg:text-3xl 2xl:text-4xl text-fipu_gray font-bold xl:mb-1 mb-2 md:mb-0 2xl:mb-4"},"Molimo unesite va\u0161e podatke",-1)),r("h2",Ue,[a[9]||(a[9]=V(" Ve\u0107 imate ra\u010Dun ili \u017Eelite samo pregledati zadatke? Povratak na prijavu ")),r("a",{class:"hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue",onClick:a[0]||(a[0]=S(i=>F(),["prevent"]))},"ovdje"),a[10]||(a[10]=V(". "))]),r("div",Se,[r("div",Pe,[t(v,{label:"Ime"},{default:l(()=>[t(g,{modelValue:o.ime,"onUpdate:modelValue":a[1]||(a[1]=i=>o.ime=i),"icon-left":e(G),error:e(f)(e(d),"ime"),name:"ime",autocomplete:"ime"},null,8,["modelValue","icon-left","error"])]),_:1}),t(v,{label:"Prezime"},{default:l(()=>[t(g,{modelValue:o.prezime,"onUpdate:modelValue":a[2]||(a[2]=i=>o.prezime=i),"icon-left":e(G),error:e(f)(e(d),"prezime"),name:"prezime",autocomplete:"prezime"},null,8,["modelValue","icon-left","error"])]),_:1}),t(v,{label:"JMBAG"},{default:l(()=>[t(g,{modelValue:o.JMBAG,"onUpdate:modelValue":a[3]||(a[3]=i=>o.JMBAG=i),"icon-left":e(ne),error:e(f)(e(d),"JMBAG"),name:"JMBAG",autocomplete:"JMBAG"},null,8,["modelValue","icon-left","error"])]),_:1}),t(v,{label:"UNIPU E-mail"},{default:l(()=>[t(g,{modelValue:o.email,"onUpdate:modelValue":a[4]||(a[4]=i=>o.email=i),"icon-left":e(de),error:e(f)(e(d),"email"),name:"email",autocomplete:"username"},null,8,["modelValue","icon-left","error"])]),_:1})]),r("div",Le,[t(v,{label:"Godina studija"},{default:l(()=>[t(g,{modelValue:o.godina_studija,"onUpdate:modelValue":a[5]||(a[5]=i=>o.godina_studija=i),"icon-left":e(ue),error:e(f)(e(d),"godina_studija"),options:e(I).GodinaStudijaMappings},null,8,["modelValue","icon-left","error","options"])]),_:1}),t(v,{label:"Lozinka"},{default:l(()=>[t(g,{modelValue:o.password,"onUpdate:modelValue":a[6]||(a[6]=i=>o.password=i),"icon-left":e(R),error:e(f)(e(d),"password"),type:"password",name:"password",autocomplete:"current-password"},null,8,["modelValue","icon-left","error"])]),_:1}),t(v,{label:"Potvrda lozinke"},{default:l(()=>[t(g,{modelValue:o.passwordConfirm,"onUpdate:modelValue":a[7]||(a[7]=i=>o.passwordConfirm=i),"icon-left":e(R),error:e(f)(e(d),"passwordConfirm"),type:"password",name:"passwordConfirm"},null,8,["modelValue","icon-left","error"])]),_:1}),r("div",Ge,[t(we,{modelValue:e(u),"onUpdate:modelValue":a[8]||(a[8]=i=>Z(u)?u.value=i:u=i),name:"data_confirmed",type:"checkbox",label:"Potvr\u0111ujem da sam pregledao i unio to\u010Dne osobne podatke.","input-value":!0},null,8,["modelValue"])])])]),t(he,{class:"space-y-2 mt-4 lg:mt-8"},{default:l(()=>[t(N,{disabled:!e(u)||_.value,type:"submit",color:"fipu_light_blue",label:"Registriraj se",loading:_.value,class:"w-full"},null,8,["disabled","loading"])]),_:1}),t(m,{ref_key:"notificationBar",ref:n,class:"animate__animated animate__fadeInUp mt-4",outline:M.value},{right:l(()=>[t(N,{icon:j.mdiClose,color:M.value?"success":"white",outline:M.value,"rounded-full":"",small:""},null,8,["icon","color","outline"])]),default:l(()=>[r("b",null,P(e(b)),1),V(" "+P(e(w))+" ",1)]),_:1},8,["outline"])]),_:1})])])]))]),_:1})]),_:1})}}},aa=_e(Re,[["__scopeId","data-v-027e9b39"]]);export{aa as default};
