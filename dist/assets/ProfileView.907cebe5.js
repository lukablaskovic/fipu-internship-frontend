import{r as v,w as Z,x as c,G as _,J as t,z as u,F as e,u as a,y as D,I as H,_ as Y,a as N,f as B,A as h,K as P,O as X,N as Q}from"./vue.f9cfebed.js";import{c as f,r as $,f as R,m as ee,h as ae,b as oe,s as J,u as te,g as S}from"./validators.3759a75c.js";import{m as o,y as se,s as L,U as V,b as re,d as ne}from"./index.943c32fd.js";import{aV as ie,_ as M,a as le,l as ue,d as j,J as de,aW as q,u as me,aX as ce,c as d,A as pe,aY as fe,aZ as _e,a_ as ve,a$ as F,H as we,I as ge}from"./BaseButton.028cc894.js";import{_ as be,a as ke}from"./SectionTitleLineWithButton.84ca72c6.js";import{_ as C}from"./CardBox.74d9f813.js";import{c as Ae}from"./SnackBar.f82320c3.js";import{_ as m}from"./FormField.ad787479.js";import{_ as I}from"./BaseButtons.e0ebdabe.js";import{e as he,a as je}from"./LayoutAuthenticated.6783f5cf.js";import{S as ye}from"./maps.a84fde3c.js";import{_ as Ve}from"./FormFilePicker.20c9096b.js";import{c as y}from"./TableAvailableAssignments.76b23393.js";import{h as Me}from"./moment-setup.afefb272.js";import"./vendor.15896b3d.js";import"./FormCheckRadio.8030a8fa.js";import"./FormCheckRadioGroup.fc40e1b5.js";import"./LoadingOverlay.9dbae0c6.js";const xe={class:"absolute right-0 bottom-0"},ze={__name:"UserAvatarCurrentUserWithUpload",setup(k){const r=v(null);return Z(r,async s=>{if(s)try{o.avatarChanging=!0;let i=null;if(o.userAdmin===!1)i=await o.updateAvatarStudent(o.currentUser.JMBAG,s),o.avatarChanging=!1;else if(o.userAdmin===!0){if(i=await o.updateAvatarAdmin(s),i.status_code===200){let w=await se.updateAdminAvatarInPostgres(o.currentUser.username,i.data.url);if(o.avatarChanging=!1,!w)return}}else return;i.status_code===200?(await o.fetchCurrentUser(),L.pushMessage("Avatar uspje\u0161no promijenjen!","success"),await V.wait(3),location.reload()):(L.pushMessage("Gre\u0161ka prilikom promjene avatara!","danger"),await V.wait(3),location.reload())}catch(i){console.error("Failed to upload avatar:",i)}}),(s,i)=>(c(),_(he,{class:"relative"},{default:t(()=>[u("div",xe,[e(Ve,{modelValue:r.value,"onUpdate:modelValue":i[0]||(i[0]=w=>r.value=w),icon:a(ie),"is-round-icon":""},null,8,["modelValue","icon"])])]),_:1}))}},Ue={},Be={class:"rounded-2xl py-12 px-6 lg:px-12 text-center"};function $e(k,r){return c(),D("div",Be,[H(k.$slots,"default")])}const O=re(Ue,[["render",$e]]),Se={__name:"SectionBannerProfile",setup(k){return(r,s)=>{const i=Y("router-link");return a(o).userAdmin?(c(),_(O,{key:0,class:"bg-gradient-to-tr from-green-300 via-fipu_blue to-blue-500"},{default:t(()=>[s[0]||(s[0]=u("h1",{class:"text-3xl text-white mb-6"},"Pogledajte aktivne prakse",-1)),e(i,{to:"/studenti"},{default:t(()=>[e(M,{icon:a(le),label:"Studenti",target:"_blank","rounded-full":""},null,8,["icon"])]),_:1})]),_:1})):(c(),_(O,{key:1,class:"bg-gradient-to-tr from-green-300 via-fipu_blue to-blue-500"},{default:t(()=>[s[1]||(s[1]=u("h1",{class:"text-3xl text-white mb-6"},"Provjerite stanje va\u0161e prakse",-1)),e(i,{to:"/moja-praksa"},{default:t(()=>[e(M,{icon:a(ue),label:"Moja praksa",target:"_blank","rounded-full":""},null,8,["icon"])]),_:1})]),_:1}))}}},Ce={class:"grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6"},Ge={class:"flex justify-start items-start"},Ne={class:"flex-1"},Pe={class:"flex justify-between items-center"},Je={class:"flex justify-start items-center mb-3"},Le={class:"text-2xl mr-1.5"},qe={class:"grid grid-cols-1 lg:grid-cols-2 gap-6"},Fe={key:1},ra={__name:"ProfileView",setup(k){const r=N({username:o.currentUser.username,ime:o.currentUser.ime,prezime:o.currentUser.prezime,JMBAG:o.currentUser.JMBAG,account_type:o.currentUser.account_type,godina_studija:o.currentUser.godina_studija,email:o.currentUser.email}),s=N({password_current:"",password:"",password_confirmation:""}),i=B(()=>s.password),w=B(()=>s.password_current),E={password_current:{required:f.withMessage("Polje je obavezno",$)},password:{sameAs:f.withMessage("Nova lozinka ne smije biti identi\u010Dna staroj",R(J(w))),required:f.withMessage("Polje je obavezno",$),minLength:f.withMessage("Lozinka mora sadr\u017Eavati minimalno 6 znakova",ee(6)),containsAlpha:f.withMessage("Lozinka mora sadr\u017Eavati barem jedno slovo",ae),containsNumeric:f.withMessage("Lozinka mora sadr\u017Eavati barem jedan broj",oe)},password_confirmation:{required:f.withMessage("Polje je obavezno",$),sameAs:f.withMessage("Lozinke se ne podudaraju",J(i))}},g=te(E,s),b=v(!1);async function T(){if(b.value=!0,g.value.$touch(),g.value.$invalid){b.value=!1;return}(await o.updatePassword(s.password_current,s.password)).message=="Invalid old password. Please try again."?G("warning"):(G("success"),await V.wait(2),o.logout()),await V.wait(3),b.value=!1}const p=v(null);let x=v(),z=v();const K=v([]),U=B(()=>K.value.indexOf("outline")>-1);function G(A){switch(A){case"success":p.value.color="success",p.value.icon=ge,p.value.duration=1,x.value="To je to!",z.value=" Lozinka uspje\u0161no promijenjena!";break;case"warning":p.value.color="warning",p.value.icon=we,p.value.duration=1,x.value="Upozorenje.",z.value=" Pogre\u0161na stara lozinka. Molimo poku\u0161ajte ponovno.";break}p.value.show()}return(A,n)=>{const W=Y("NotificationBar");return c(),_(je,null,{default:t(()=>[e(ke,null,{default:t(()=>[e(be,{icon:a(j),title:"Korisni\u010Dki profil",main:""},null,8,["icon"]),u("div",Ce,[e(C,{flex:"flex-row",class:"items-center rounded"},{default:t(()=>[u("div",Ge,[e(ze,{class:"w-24 h-24 md:w-36 md:h-36 mr-6"}),u("div",Ne,[u("div",Pe,[u("div",Je,[u("h1",Le,h(a(o).currentUser.ime)+" "+h(a(o).currentUser.prezime),1),e(ne,{path:a(de),size:22,class:"text-blue-400"},null,8,["path"])])]),e(I,{class:"text-fipu_gray dark:text-gray-300"},{default:t(()=>[a(o).userAdmin?(c(),_(y,{key:0,"reverse-dark":!0,label:"Admin",icon:a(q)},null,8,["icon"])):(c(),_(y,{key:1,"reverse-dark":!0,label:"Student",icon:a(q)},null,8,["icon"])),e(y,{"reverse-dark":!0,label:"FIPU",icon:a(me)},null,8,["icon"]),e(y,{"reverse-dark":!0,label:a(Me).parseZone(a(o).currentUser.created_at).format("D. MMMM YYYY."),icon:a(ce)},null,8,["label","icon"])]),_:1})])])]),_:1}),e(Se)]),u("div",qe,[e(C,{"is-form":"",class:"rounded"},{default:t(()=>[r.account_type!="student"?(c(),_(m,{key:0,label:"Korisni\u010Dko ime"},{default:t(()=>[e(d,{modelValue:r.username,"onUpdate:modelValue":n[0]||(n[0]=l=>r.username=l),icon:a(j),readonly:"",name:"userName",autocomplete:"userName"},null,8,["modelValue","icon"])]),_:1})):P("",!0),e(m,{label:"Ime"},{default:t(()=>[e(d,{modelValue:r.ime,"onUpdate:modelValue":n[1]||(n[1]=l=>r.ime=l),icon:a(j),name:"ime",readonly:"",autocomplete:"ime"},null,8,["modelValue","icon"])]),_:1}),e(m,{label:"Prezime"},{default:t(()=>[e(d,{modelValue:r.prezime,"onUpdate:modelValue":n[2]||(n[2]=l=>r.prezime=l),icon:a(j),name:"prezime",readonly:"",autocomplete:"prezime"},null,8,["modelValue","icon"])]),_:1}),e(m,{label:"E-mail"},{default:t(()=>[e(d,{modelValue:r.email,"onUpdate:modelValue":n[3]||(n[3]=l=>r.email=l),icon:a(pe),type:"email",name:"email",readonly:"",autocomplete:"email"},null,8,["modelValue","icon"])]),_:1}),a(o).userAdmin?P("",!0):(c(),D("div",Fe,[e(m,{label:"JMBAG"},{default:t(()=>[e(d,{modelValue:r.JMBAG,"onUpdate:modelValue":n[4]||(n[4]=l=>r.JMBAG=l),icon:a(fe),type:"JMBAG",name:"JMBAG",readonly:"",autocomplete:"JMBAG"},null,8,["modelValue","icon"])]),_:1}),e(m,{label:"Godina studija"},{default:t(()=>[e(d,{"model-value":a(ye).getGodinaStudija(r.godina_studija),icon:a(_e),type:"JMBAG",name:"JMBAG",readonly:"",autocomplete:"JMBAG"},null,8,["model-value","icon"])]),_:1})]))]),_:1}),e(C,{"is-form":"",class:"rounded",onSubmit:X(T,["prevent"])},{default:t(()=>[e(m,{label:"Trenutna lozinka",help:"Obavezno. Va\u0161a trenutna lozinka"},{default:t(()=>[e(d,{modelValue:s.password_current,"onUpdate:modelValue":n[5]||(n[5]=l=>s.password_current=l),icon:a(ve),error:a(S)(a(g),"password_current"),name:"password_current",type:"password",required:"",autocomplete:"password_current"},null,8,["modelValue","icon","error"])]),_:1}),e(Ae),e(m,{label:"Nova lozinka",help:"Obavezno. Va\u0161a nova lozinka"},{default:t(()=>[e(d,{modelValue:s.password,"onUpdate:modelValue":n[6]||(n[6]=l=>s.password=l),icon:a(F),required:"",error:a(S)(a(g),"password"),type:"password",name:"password",autocomplete:"password"},null,8,["modelValue","icon","error"])]),_:1}),e(m,{label:"Potvrdi lozinku",help:"Obavezno. Nova lozinka jo\u0161 jednom"},{default:t(()=>[e(d,{modelValue:s.password_confirmation,"onUpdate:modelValue":n[7]||(n[7]=l=>s.password_confirmation=l),icon:a(F),required:"",error:a(S)(a(g),"password_confirmation"),type:"password",name:"password_confirmation",autocomplete:"password_confirmation"},null,8,["modelValue","icon","error"])]),_:1}),e(I,null,{default:t(()=>[e(M,{disabled:b.value,loading:b.value,type:"submit",color:"fipu_blue",label:"A\u017Euriraj!"},null,8,["disabled","loading"])]),_:1}),e(W,{ref_key:"notificationBar",ref:p,class:"animate__animated animate__fadeInUp mt-2",outline:U.value},{right:t(()=>[e(M,{icon:A.mdiClose,color:U.value?"success":"white",outline:U.value,"rounded-full":"",small:""},null,8,["icon","color","outline"])]),default:t(()=>[u("b",null,h(a(x)),1),Q(" "+h(a(z))+" ",1)]),_:1},8,["outline"])]),_:1})])]),_:1})]),_:1})}}};export{ra as default};
