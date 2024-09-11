import{x as u,y as _,z as t,A as C,K as w,S as B,r as L,f as U,w as N,G as M,J as r,F as l,u as o,b as $,H as J,M as K,C as S,a as F,q as R,N as P,O as G}from"./vue.f9cfebed.js";import{bd as W,be as X,bf as Y,bg as Q,bh as ee,bi as ae,l as oe,Z as le,p as te,c,u as q,A as ie,v as ne,bj as re,b as se,bk as ue,w as de,bl as pe,bm as me,aZ as je,bn as ce,_ as A}from"./BaseButton.028cc894.js";import{a as fe,_ as D}from"./SectionTitleLineWithButton.84ca72c6.js";import{_ as ve,F as ke,b as be,c as _e,a as ge}from"./SnackBar.f82320c3.js";import{_ as ze}from"./CardBox.74d9f813.js";import{_ as s}from"./FormField.ad787479.js";import{b as Z,m as I,s as O,e as he,U as Ve}from"./index.943c32fd.js";import{_ as T}from"./FormCheckRadioGroup.fc40e1b5.js";import{c as p,r as v,d as we,u as Pe,g as m}from"./validators.3759a75c.js";import"./vendor.15896b3d.js";import"./FormCheckRadio.8030a8fa.js";const ye={name:"CheckIcon",emits:["click"],props:{title:{type:String},fillColor:{type:String,default:"currentColor"},size:{type:Number,default:24}}},xe=["aria-hidden","aria-label"],Me=["fill","width","height"],Le={d:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"},Ue={key:0};function Ce(g,k,e,z,j,b){return u(),_("span",B(g.$attrs,{"aria-hidden":e.title?null:!0,"aria-label":e.title,class:"material-design-icon check-icon",role:"img",onClick:k[0]||(k[0]=n=>g.$emit("click",n))}),[(u(),_("svg",{fill:e.fillColor,class:"material-design-icon__svg",width:e.size,height:e.size,viewBox:"0 0 24 24"},[t("path",Le,[e.title?(u(),_("title",Ue,C(e.title),1)):w("",!0)])],8,Me))],16,xe)}const $e=Z(ye,[["render",Ce]]),Se={name:"UnfoldMoreHorizontalIcon",emits:["click"],props:{title:{type:String},fillColor:{type:String,default:"currentColor"},size:{type:Number,default:24}}},Ne=["aria-hidden","aria-label"],Fe=["fill","width","height"],qe={d:"M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"},Ae={key:0};function De(g,k,e,z,j,b){return u(),_("span",B(g.$attrs,{"aria-hidden":e.title?null:!0,"aria-label":e.title,class:"material-design-icon unfold-more-horizontal-icon",role:"img",onClick:k[0]||(k[0]=n=>g.$emit("click",n))}),[(u(),_("svg",{fill:e.fillColor,class:"material-design-icon__svg",width:e.size,height:e.size,viewBox:"0 0 24 24"},[t("path",qe,[e.title?(u(),_("title",Ae,C(e.title),1)):w("",!0)])],8,Fe))],16,Ne)}const Ie=Z(Se,[["render",De]]),Oe={class:"relative z-50"},Te={class:"relative w-full cursor-default overflow-hidden rounded bg-white text-left sm:text-sm border border-gray hover:border-fipu_blue focus:border-fipu_blue"},Be={key:0,class:"relative cursor-default select-none py-2 px-4 text-gray-700"},Ze={__name:"FormCombobox",props:{options:{type:Array,default:()=>[]},placeholder:{type:String,default:""}},emits:["update:modelValue"],setup(g,{emit:k}){const e=k,z=g;let j=L(""),b=U(()=>j.value===""?z.options:z.options.filter(h=>h.label.toLowerCase().replace(/\s+/g,"").includes(j.value.toLowerCase().replace(/\s+/g,"")))),n=L(b.value[0]);return N(()=>n.value,h=>{e("update:modelValue",h)}),N(()=>j.value,h=>{h||(n.value=L())}),(h,V)=>(u(),M(o(ae),{modelValue:o(n),"onUpdate:modelValue":V[2]||(V[2]=d=>$(n)?n.value=d:n=d)},{default:r(()=>[t("div",Oe,[t("div",Te,[l(o(W),{class:"w-full px-3 py-2 max-w-full focus:ring focus:outline-none dark:placeholder-gray-400 h-12 dark:bg-slate-800","display-value":d=>d.label,placeholder:z.placeholder,onChange:V[0]||(V[0]=d=>$(j)?j.value=d.target.value:j=d.target.value)},null,8,["display-value","placeholder"]),l(o(X),{class:"absolute inset-y-0 right-0 flex items-center pr-2"},{default:r(()=>[l(Ie,{class:"h-5 w-5 text-gray-700 hover:text-fipu_blue","aria-hidden":"true"})]),_:1})]),l(o(Y),{leave:"transition ease-in duration-100","leave-from":"opacity-100","leave-to":"opacity-0",onAfterLeave:V[1]||(V[1]=d=>$(j)?j.value="":j="")},{default:r(()=>[l(o(Q),{class:"absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"},{default:r(()=>[o(b).length===0&&o(j)!==""?(u(),_("div",Be,"Nema rezultata.")):w("",!0),(u(!0),_(J,null,K(o(b),d=>(u(),M(o(ee),{key:d.id,as:"template",value:d},{default:r(({selected:y,active:x})=>[t("li",{class:S(["relative cursor-default select-none py-2 pl-10 pr-4",{"bg-fipu_blue text-white":x,"text-gray-900":!x}])},[t("span",{class:S(["block truncate",{"font-medium":y,"font-normal":!y}])},C(d.label),3),y?(u(),_("span",{key:0,class:S(["absolute inset-y-0 left-0 flex items-center pl-3",{"text-white":x,"text-fipu_blue":!x}])},[l($e,{class:"h-5 w-5 text-fipu_blue","aria-hidden":"true"})],2)):w("",!0)],2)]),_:2},1032,["value"]))),128))]),_:1})]),_:1})])]),_:1},8,["modelValue"]))}},Ee={href:"/",target:"_blank"},He=["src"],Je={class:"grid grid-cols-1 gap-6 mb-6"},ta={__name:"NewAssignmentFormPublic",setup(g){const k={Poslodavac:"",Poslodavac_novi_naziv:"",poslodavac_email:"",opis_zadatka:"",preferirane_tehnologije:"",broj_studenata:"",preferencije_za_studenta:"",potrebno_imati:"",trajanje_sati:"",lokacija:"",zeljeno_okvirno_vrijeme_pocetka:"",angazman_selekcija:!1,angazman_fipu:"",napomena:"",selekcija:!1,proces_selekcije:""},e=F({...k}),z=f=>f>0,j=F({Poslodavac:U(()=>e.Poslodavac_novi_naziv?{}:{required:p.withMessage("Polje je obavezno",v)}),Poslodavac_novi_naziv:U(()=>e.Poslodavac?{}:{required:p.withMessage("Polje je obavezno",v)}),poslodavac_email:{required:p.withMessage("Polje je obavezno",v),email:p.withMessage("Molimo unesite ispravnu e-mail adresu",we)},opis_zadatka:{required:p.withMessage("Polje je obavezno",v)},preferirane_tehnologije:{},broj_studenata:{required:p.withMessage("Polje je obavezno",v),maxValue:p.withMessage("Minimalno 1 student",z)},preferencije_za_studenta:{},potrebno_imati:{},trajanje_sati:{required:p.withMessage("Polje je obavezno",v),maxValue:p.withMessage("Mora biti ve\u0107e od 0",z)},lokacija:{required:p.withMessage("Polje je obavezno",v)},zeljeno_okvirno_vrijeme_pocetka:{required:p.withMessage("Polje je obavezno",v)},angazman_selekcija:{required:p.withMessage("Polje je obavezno",v)},angazman_fipu:U(()=>e.angazman_selekcija==="true"?{required:p.withMessage("Polje je obavezno",v)}:{}),proces_selekcije:U(()=>e.selekcija===!0?{required:p.withMessage("Polje je obavezno",v)}:{}),napomena:{},selekcija:{required:p.withMessage("Polje je obavezno",v)}}),b=L(!1),n=Pe(j,e);function h(){for(const f in k)e[f]=k[f];n.value.$reset(),O.pushMessage("Forma je resetirana!","success")}async function V(){if(b.value=!0,n.value.$touch(),n.value.$invalid){b.value=!1;return}e.angazman_selekcija==="false"&&(e.angazman_fipu="Nema"),e.selekcija||(e.proces_selekcije="Nema");let f=await he.submitNewInternshipProject(e);b.value=!1,f&&(O.pushMessage("Uspje\u0161no ste prijavili zadatak!","success"),await Ve.wait(1),location.reload())}const d=L([]),y=L([]),x={true:"Da",false:"Ne"},E={true:"Da",false:"Ne"};R(async()=>{let f=await I.fetchCompanies();d.value=f.data.results,y.value=d.value.map((a,i)=>({id:i+1,label:a.naziv}))}),N(()=>e.selekcija,f=>{typeof f=="string"&&(e.selekcija=f==="true")});const H=()=>{e.Poslodavac&&(e.Poslodavac_novi_naziv="")};return(f,a)=>(u(),_("div",null,[l(fe,null,{default:r(()=>[l(D,{icon:o(oe),title:"FIPU Praksa",main:""},{default:r(()=>[t("a",Ee,[t("img",{src:o(ke),class:"max-h-14 object-contain"},null,8,He)])]),_:1},8,["icon"]),t("p",null,[a[17]||(a[17]=t("b",null,"Akademska godina:",-1)),P(" "+C(o(I).academicYear),1)]),a[18]||(a[18]=t("p",null,[t("b",null,"Voditelj:"),P(" doc. dr. sc. Ivan Lorencin")],-1)),a[19]||(a[19]=t("hr",null,null,-1)),a[20]||(a[20]=t("br",null,null,-1)),l(D,{icon:o(le),main:"",title:"Prijava zadatka (Poslodavci)"},null,8,["icon"]),a[21]||(a[21]=t("p",null,[P("Ova prijavnica je namijenjena "),t("u",null,"poduze\u0107ima i organizacijama"),P(" koje \u017Eele provoditi studentsku praksu u suradnji s Fakultetom informatike u Puli. Na temelju ovog upitnika odredit \u0107e se idealni studenti za provo\u0111enje prakse u Va\u0161em poduze\u0107u.")],-1)),a[22]||(a[22]=t("br",null,null,-1)),a[23]||(a[23]=t("p",null,"Studentima je ovo izborni kolegij i oni koji su prijavljeni, motivirani su i spremni za rad!",-1)),a[24]||(a[24]=t("br",null,null,-1)),a[25]||(a[25]=t("p",null,[t("b",null,"Va\u017Ena napomena:"),P(" Pojedina organizacija mo\u017Ee prijaviti i vi\u0161e zadataka. Molimo da za svaki zadatak zasebno popunite prijavnicu (isti link) te zatra\u017Eite broj studenata koji mo\u017Ee na njemu raditi (npr. mo\u017Ee biti 2 zadataka, na prvom 3 studenta, na drugom 4).")],-1)),a[26]||(a[26]=t("br",null,null,-1)),a[27]||(a[27]=t("p",null,"Za sve dodatne informacije slobodno kontaktirajte voditelja stru\u010Dne prakse:",-1)),a[28]||(a[28]=t("br",null,null,-1)),a[29]||(a[29]=t("div",{class:"w-full shrink-0 grow-0 basis-auto lg:w-7/12"},[t("div",{class:"flex flex-wrap"},[t("div",{class:"mb-6 w-full shrink-0 grow-0 basis-auto md:w-6/12"},[t("div",{class:"flex items-start"},[t("div",{class:"shrink-0"},[t("div",{class:"inline-block rounded-md bg-primary-100 p-4 w-24 h-24 text-primary items-center"},[t("a",{href:"https://fipu.unipu.hr/fipu/ivan.lorencin",target:"_blank"},[t("img",{class:"rounded-full",src:"https://fipu.unipu.hr/images/users_profiles/Ivan-Lorencin.jpg",alt:"Ivan Lorencin"})])])]),t("div",{class:"ml-3 grow"},[t("p",{class:"mb-2 font-bold dark:text-white"},"doc. dr. sc. Ivan Lorencin"),t("p",{class:"text-neutral-500 dark:text-neutral-200"},"ivan.lorencin@unipu.hr"),t("p",{class:"text-neutral-500 dark:text-neutral-200"},"+385 98 30 56 73")])])])])],-1)),t("div",Je,[l(ze,{icon:o(te),class:"mb-6 lg:mb-0 lg:col-span-2 xl:col-span-3","is-form":"",onSubmit:G(V,["prevent"])},{default:r(()=>[l(be,{class:"text-center",title:"\u{1F4BC}Prijava projekta za studentsku praksu "}),e.Poslodavac_novi_naziv?w("",!0):(u(),M(s,{key:0,label:"Poduze\u0107e partner",help:"Ako niste partner, unesite naziv poduze\u0107a ispod",horizontal:""},{default:r(()=>[l(Ze,{modelValue:e.Poslodavac,"onUpdate:modelValue":a[0]||(a[0]=i=>e.Poslodavac=i),options:y.value,placeholder:"Odaberite poduze\u0107e ako ste postoje\u0107i partner",onChange:H},null,8,["modelValue","options"])]),_:1})),e.Poslodavac?w("",!0):(u(),M(s,{key:1,label:"Naziv poduze\u0107a",horizontal:""},{default:r(()=>[l(c,{modelValue:e.Poslodavac_novi_naziv,"onUpdate:modelValue":a[1]||(a[1]=i=>e.Poslodavac_novi_naziv=i),"icon-left":o(q),help:"Ovdje unesite naziv poduze\u0107a ako ste novi partner (nema vas u dropdown obrascu iznad)",error:o(m)(o(n),"Poslodavac_novi_naziv"),placeholder:"Naziv poduze\u0107a"},null,8,["modelValue","icon-left","error"])]),_:1})),l(s,{label:"Kontakt email",horizontal:""},{default:r(()=>[l(c,{modelValue:e.poslodavac_email,"onUpdate:modelValue":a[2]||(a[2]=i=>e.poslodavac_email=i),"icon-left":o(ie),type:"email",error:o(m)(o(n),"poslodavac_email"),help:"E-mail adresa pri kojoj \u0107e se student obratiti oko dogovora za izvo\u0111enje studentske prakse ili provedbu selekcije. Ne mora nu\u017Eno biti budu\u0107i mentor.",placeholder:"Va\u0161 kontakt email"},null,8,["modelValue","icon-left","error"])]),_:1}),l(_e),l(s,{label:"Detaljan opis zadatka",horizontal:""},{default:r(()=>[l(c,{modelValue:e.opis_zadatka,"onUpdate:modelValue":a[3]||(a[3]=i=>e.opis_zadatka=i),type:"textarea",placeholder:"Zadatak \u0107e se sastojati od ... Student \u0107e raditi na ...",error:o(m)(o(n),"opis_zadatka"),"icon-left":o(ne),help:"Opis zadataka koji bi student izvr\u0161avao. Mo\u017Ee biti: mala (web, mobilna, desktop) aplikacija, program za obradu podataka, analiza podataka, pobolj\u0161anje postoje\u0107eg koda (engl. code refactoring), pomo\u0107 pri odr\u017Eavanju ra\u010Dunalne ili aplikacijske infrastrukture - DevOps poslovi, ... Preporu\u010Duje se \u0161to detaljniji opis kako bi mogli alocirati idealnog kandidata."},null,8,["modelValue","error","icon-left"])]),_:1}),l(s,{label:`Preferirane tehnologije/platforme
`,horizontal:""},{default:r(()=>[l(c,{modelValue:e.preferirane_tehnologije,"onUpdate:modelValue":a[4]||(a[4]=i=>e.preferirane_tehnologije=i),type:"textarea",error:o(m)(o(n),"preferirane_tehnologije"),placeholder:"Npr. PHP, Laravel, Python, Django, JavaScript, Vue.js, Unity, WordPress, TensorFlow...","icon-left":o(re),help:`\u0160to sve koristi va\u0161a tvrtka ili na \u010Demu \u0107e se temeljiti rad studenta? Npr. PHP, Laravel, Python, Django, JavaScript, Vue.js, Unity, WordPress, TensorFlow...
`},null,8,["modelValue","error","icon-left"])]),_:1}),l(s,{label:"Broj studenata",horizontal:""},{default:r(()=>[l(s,{addons:""},{default:r(()=>[l(c,{modelValue:e.broj_studenata,"onUpdate:modelValue":a[5]||(a[5]=i=>e.broj_studenata=i),type:"number","icon-left":o(se),error:o(m)(o(n),"broj_studenata"),min:1,placeholder:"Maksimalni broj studenata",help:"Koliko studenata mo\u017Eete primiti u rje\u0161avanju ovog zadatka? Studenti mogu raditi odvojeno ili u timu. Ako imate vi\u0161e zadataka, mo\u017Eete ponovno popuniti formu za svaki zadatak posebno.",expanded:""},null,8,["modelValue","icon-left","error"])]),_:1})]),_:1}),l(s,{label:`Preferencije pri odabiru studenta
`,horizontal:""},{default:r(()=>[l(c,{modelValue:e.preferencije_za_studenta,"onUpdate:modelValue":a[6]||(a[6]=i=>e.preferencije_za_studenta=i),type:"textarea",error:o(m)(o(n),"preferencije_za_studenta"),placeholder:"Po\u017Eeljni kandidat posjeduje znanja iz ... ima iskustva u...","icon-left":o(ue),help:"U koliko smatrate va\u017Enim, opi\u0161ite odlike po\u017Eeljnog kandidata na praksi."},null,8,["modelValue","error","icon-left"])]),_:1}),l(s,{label:"Potrebna infrastruktura koju student mora posjedovati",horizontal:""},{default:r(()=>[l(c,{modelValue:e.potrebno_imati,"onUpdate:modelValue":a[7]||(a[7]=i=>e.potrebno_imati=i),error:o(m)(o(n),"potrebno_imati"),"icon-left":o(q),help:"Potrebna infrastruktura koju student mora posjedovati",placeholder:"Npr. laptop"},null,8,["modelValue","error","icon-left"])]),_:1}),l(s,{label:"\u017Deljeno trajanje prakse",horizontal:""},{default:r(()=>[l(s,{addons:""},{default:r(()=>[l(c,{modelValue:e.trajanje_sati,"onUpdate:modelValue":a[8]||(a[8]=i=>e.trajanje_sati=i),type:"number",error:o(m)(o(n),"trajanje_sati"),"icon-left":o(de),placeholder:"Preporuka je 90 - 150 radnih sati",help:`Preporu\u010Deno trajanje studentske prakse je izme\u0111u 90 i 150 radnih sati. U dogovoru sa studentom mo\u017Ee se kasnije taj anga\u017Eman produljiti. Dogovor kako \u0107e se izvr\u0161iti ti sati je izme\u0111u vas i studenta (npr. koncentrirano u 2-3 tjedna ili par puta tjedno kroz dulje vrijeme).
`,expanded:""},null,8,["modelValue","error","icon-left"])]),_:1})]),_:1}),l(s,{label:"Lokacija",horizontal:""},{default:r(()=>[l(c,{modelValue:e.lokacija,"onUpdate:modelValue":a[9]||(a[9]=i=>e.lokacija=i),help:"Mogu\u0107a je 'remote' praksa",error:o(m)(o(n),"lokacija"),"icon-left":o(pe),placeholder:"Lokacija odr\u017Eavanja prakse"},null,8,["modelValue","error","icon-left"])]),_:1}),l(s,{label:"\u017Deljeno okvirno vrijeme po\u010Detka",horizontal:""},{default:r(()=>[l(c,{modelValue:e.zeljeno_okvirno_vrijeme_pocetka,"onUpdate:modelValue":a[10]||(a[10]=i=>e.zeljeno_okvirno_vrijeme_pocetka=i),"icon-left":o(me),error:o(m)(o(n),"zeljeno_okvirno_vrijeme_pocetka"),placeholder:"npr. Velja\u010Da 2024.",help:"Praksa se mora obaviti najkasnije do 1. rujna sljede\u0107e godine."},null,8,["modelValue","icon-left","error"])]),_:1}),l(s,{label:"Anga\u017Eman nastavnika s FIPU",help:"Po \u017Eelji, nastavno osoblje FIPU-a mo\u017Ee pomo\u0107i pri izvo\u0111enju prakse na na\u010Din da oni dijelom (ili u potpunosti) mentoriraju studenta. Mogu\u0107e je \u010Dak da student u na\u0161em laboratoriju obavlja praksu, te povremeno dolazi prezentirati u\u010Dinjeno.",horizontal:""},{default:r(()=>[l(T,{modelValue:e.angazman_selekcija,"onUpdate:modelValue":a[11]||(a[11]=i=>e.angazman_selekcija=i),error:o(m)(o(n),"angazman_selekcija"),name:"angazman_selection",type:"radio",options:x,"component-class":"check-radio-warning"},null,8,["modelValue","error"])]),_:1}),e.angazman_selekcija==="true"?(u(),M(s,{key:2,label:"Opis anga\u017Emana nastavnika",help:"Molimo da detaljnije opi\u0161ite anga\u017Eman nastavnog osoblja i proces obavljanje prakse.",horizontal:""},{default:r(()=>[l(c,{modelValue:e.angazman_fipu,"onUpdate:modelValue":a[12]||(a[12]=i=>e.angazman_fipu=i),error:o(m)(o(n),"angazman_fipu"),type:"textarea","icon-left":o(je),disabled:e.angazman_selekcija===!1},null,8,["modelValue","error","icon-left","disabled"])]),_:1})):w("",!0),l(s,{label:"Dodatna napomena",horizontal:""},{default:r(()=>[l(c,{modelValue:e.napomena,"onUpdate:modelValue":a[13]||(a[13]=i=>e.napomena=i),"icon-left":o(ce),placeholder:"Slobodno unesite napomenu, nije obavezno.",error:o(m)(o(n),"napomena"),type:"textarea"},null,8,["modelValue","icon-left","error"])]),_:1}),l(s,{label:"Selekcijski postupak",help:`\u017Delite li provesti dodatnu selekciju kandidata koji se prijave na praksu (npr. intervju, ispit) ?
`,horizontal:""},{default:r(()=>[l(T,{modelValue:e.selekcija,"onUpdate:modelValue":a[14]||(a[14]=i=>e.selekcija=i),name:"selekcija_selection",error:o(m)(o(n),"selekcija"),type:"radio",options:E,"component-class":"check-radio-warning"},null,8,["modelValue","error"])]),_:1}),e.selekcija===!0?(u(),M(s,{key:3,label:"Proces selekcije",horizontal:""},{default:r(()=>[l(c,{modelValue:e.proces_selekcije,"onUpdate:modelValue":a[15]||(a[15]=i=>e.proces_selekcije=i),error:o(m)(o(n),"proces_selekcije"),type:"textarea",disabled:e.selekcija===!1,help:"Molimo da opi\u0161ete postupak selekcije, da studenti otprilike znaju \u0161to o\u010Dekivati."},null,8,["modelValue","error","disabled"])]),_:1})):w("",!0),l(s,{horizontal:"",grouped:""},{default:r(()=>[l(A,{label:"Po\u0161alji",type:"submit",disabled:b.value,loading:b.value,color:"fipu_blue"},null,8,["disabled","loading"]),l(A,{label:"Resetiraj formu",color:"danger",onClick:a[16]||(a[16]=i=>h())})]),_:1})]),_:1},8,["icon"])])]),_:1}),l(ve,null,{default:r(()=>a[30]||(a[30]=[t("br",null,null,-1),P("Made with "),t("span",{style:{color:"#e25555"}},"\u2665",-1),P(" at FIPU.lab")])),_:1}),l(ge)]))}};export{ta as default};
