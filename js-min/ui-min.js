function unix_time(){return Math.floor((new Date).getTime()/1e3)}function version_switch(e,t){var n=t[Number(e)];if(!n)throw"Bad version given: "+e;return n()}function key_data(e){var t=[e.version];fields=version_switch(e.version,{1:function(){return[e.email,e.passphrase,e.host,e.generation,e.secbits]},2:function(){return[e.email,e.passphrase,e.secbits]}}),t=t.concat(fields);var n=t.join(";");e.key=n}function $(e){return document.getElementById(e)}function toggle_computing(){$("result-need-input").style.visibility="hidden",$("result-computing").style.visibility="visible",$("result-computed").style.visibility="hidden"}function selectText(e){e.srcElement.focus(),e.srcElement.select()}function toggle_computed(){$("result-need-input").style.visibility="hidden",$("result-computed").style.visibility="visible",$("result-computing").style.visibility="hidden"}function get_url_params(){var e={},t,n=/\+/g,r=/([^&=]+)=?([^&]*)/g,i=function(e){return decodeURIComponent(e.replace(n," "))},s=window.location.hash.substring(1);while(t=r.exec(s))e[i(t[1])]=i(t[2]);return e}function format_pw(e){var t=e.slice(0,display_prefs.length);return t=add_syms(t,display_prefs.nsym),t}function finish_compute(e){e.computing=!1,context.key=null,pw=version_switch(e.version,{2:function(){return v2_finish_compute(e)},1:function(){return pw=e.generated_pw}}),toggle_computed(),$("generated_pw").value=format_pw(pw)}function display_computing(e){var t=$("computing").firstChild;t.nodeValue="computing.... "+e}function versioned_pwgen(e,t,n){var r=!1;return r=version_switch(e.version,{1:function(){return v1_pwgen(e,t,n)},2:function(){return v2_pwgen(e,t,n)}}),r}function do_compute_loop(e,t){var n=t,r=10;e==context.key&&(versioned_pwgen(t,r,context)?finish_compute(t):(display_computing(t.iter),setTimeout(function(){do_compute_loop(e,n)},0)))}function make_compute_obj_from_cache(e,t){var n={};return n=version_switch(e.version,{1:function(){return t},2:function(){return e.DK=t.DK,e}}),n}function do_compute(e){toggle_computing();var t=e.key,n=cache[t];n||(cache[t]=e,n=e),n.compute_done?finish_compute(make_compute_obj_from_cache(e,n)):n.computing||(context.key=t,n.computing=!0,n.iter=0,display_computing(""),setTimeout(function(){do_compute_loop(t,n)},500))}function trim(e){var t=/^(\s*)(.*?)(\s*)$/,n=e.match(t);return n[2]}function clean_host(e){return trim(e).toLowerCase()}function clean_email(e){return trim(e).toLowerCase()}function v1_clean_passphrase(e){var t=trim(e);return t.replace(/\s+/g," ")}function v2_clean_passphrase(e){return e.replace(/\s+/g,"")}function clean_passphrase(e,t){return version_switch(t,{1:function(){return v1_clean_passphrase(e)},2:function(){return v2_clean_passphrase(e)}})}function set_timer(e){var t=unix_time();if(!e.set||t-e.set_at>e.wiggle_room)e.set=!0,e.set_at=t,setTimeout(function(){timer_event(e)},e.timeout*1e3)}function timer_event(e){var t=unix_time();e.set&&t-e.set_at>=e.timeout&&(e.set=!1,e.set_at=0,e.timer_event())}function set_all_timers(){set_timer(pp_timer),set_timer(cache_timer)}function pp_input(e){set_all_timers(),swizzle(e)}function swizzle(e){var t=e.srcElement;t.value.length>0&&(inputs[t.id]=1);var n,r,i,s=$("version").value;inputs.passphrase&&inputs.host&&inputs.email&&(n=clean_email($("email").value),r=clean_passphrase($("passphrase").value,s),i=clean_host($("host").value));if(r&&r.length&&i&&i.length&&n&&n.length){var o={email:n,host:i,passphrase:r},u=["generation","secbits"],a,f,l;for(a=0;a<u.length;a++)f=u[a],l=$(f).value,o[f]=l;o.version=s,display_prefs.length=$("length").value,display_prefs.nsym=$("nsym").value,key_data(o),do_compute(o)}return 0}function ungray(e){e.className+=" input-black"}function acceptFocus(e){var t=e.srcElement;t.className.match("input-black")||(ungray(t),t.value="")}function prepopulate(){var e=get_url_params(),t=["email","version","length","secbits","passphrase"],n;for(n in t){curr=t[n];if(typeof e[curr]!="undefined"&&e[curr].length>0){var r=$(curr);ungray(r),r.value=e[curr],inputs[curr]=1}}}function domobiles(){var e=/iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()),t=/android|blackberry/i.test(navigator.userAgent.toLowerCase());e&&(browser.mobsafari=!0,$("email").type="email")}function doExpand(e){$("expander").style.display="none",$("advanced").style.display="inline"}function doCollapse(e){$("expander").style.display="inline",$("advanced").style.display="none"}var inputs={},cache={},browser={},context={running:0,key:null},pp_timer={set:!1,set_at:0,wiggle_room:30,timeout:300,timer_event:function(){$("passphrase").value=""}},cache_timer={set:!1,set_at:0,wiggle_room:30,timeout:1800,timer_event:function(){cache={}}},display_prefs={};