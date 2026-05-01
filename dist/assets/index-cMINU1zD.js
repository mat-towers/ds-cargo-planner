(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={ceramics:[40,80,160,320,480,640,800],chemicals:[30,60,120,240,360,480,600],metals:[50,100,200,400,600,800,1e3],resins:[40,80,160,320,480,640,800],specialAlloys:[60,120,240,480,720,960,1200]},t={0:`S`,1:`M`,2:`L`,3:`XL`,4:`XL1`,5:`XL2`,6:`XL3`},n=[1,2,4,6,6,6,6],r={bridgesTruck:[`Bridges Truck`,168],muleTruck:[`MULE Truck`,42],floatingCarrier:[`Floating Carrier`,32],reverseTrike:[`Reverse Trike`,12],reverseTrikeCargo:[`Reverse Trike`,24]},i=class{constructor({cargoContent:e,isMaterial:t,boxes:n,amount:r}){if(this.cargoContent=e,this.isMaterial=!!t,this.materialAmount=null,this.isMaterial){let e=Number(r);this.materialAmount=e,this.boxes=this.materialDistribution(e)}else this.boxes=this.#t(n);this.occupiedSpace=this.#e(this.boxes)}#e(e){let t=0;for(let r=0;r<e.length;r++)t+=e[r]*n[r];return t}#t(e){let t=[0,0,0,0,0,0,0];if(!Array.isArray(e))return t;for(let n=0;n<4;n++){let r=Number(e[n]);t[n]=Number.isFinite(r)&&r>0?Math.trunc(r):0}return t}materialDistribution(t){let n=e[this.cargoContent];if(!n)throw Error(`Invalid material type selected.`);if(!Number.isFinite(t)||t<=0)throw Error(`Material amount must be greater than 0.`);let r=[0,0,0,0,0,0,0],i=t;for(let e=r.length-1;e>=0;e--){let t=Math.trunc(i/n[e]);t>0&&(r[e]=t,i-=t*n[e])}return i>0&&(r[0]+=1),r}getCargoContent(){return this.cargoContent}getBoxes(){return[...this.boxes]}getIsMaterial(){return this.isMaterial}getMaterialAmount(){return this.materialAmount}getOccupiedSpace(){return this.occupiedSpace}},a=class e{static nextOrderId=1;static resetOrderIds(){e.nextOrderId=1}constructor(t,n){this.orderId=e.nextOrderId++,this.orderName=t||`Order ${this.orderId}`,this.cargoList=Array.isArray(n)?n:[],this.totalSCU=0,this.#e()}#e(){let e=0;for(let t of this.cargoList)e+=t.getOccupiedSpace();this.totalSCU=e}addCargo(e){this.cargoList.push(e),this.#e()}removeCargoAt(e){return e<0||e>=this.cargoList.length?!1:(this.cargoList.splice(e,1),this.#e(),!0)}isEmpty(){return this.cargoList.length===0}getOrderId(){return this.orderId}getOrderName(){return this.orderName}getTotalSCU(){return this.totalSCU}getCargoList(){return this.cargoList}},o=class{constructor(e){this.orders=[],this.vehicle=e,this.currentAvailableStorage=this.vehicle[1]}addOrder(e){let t=e.getTotalSCU();return t>this.currentAvailableStorage?!1:(this.orders.push(e),this.currentAvailableStorage-=t,!0)}removeOrderAt(e){if(e<0||e>=this.orders.length)return!1;let[t]=this.orders.splice(e,1);return this.currentAvailableStorage+=t.getTotalSCU(),!0}getOrders(){return this.orders}getVehicleCapacity(){return this.vehicle[1]}getUsedStorage(){return this.getVehicleCapacity()-this.currentAvailableStorage}getCurrentAvailableStorage(){return this.currentAvailableStorage}},s=Object.keys(e);document.querySelector(`#app`).innerHTML=`
  <div class="planner-layout">
    <h1>Cargo Planner</h1>

    <form id="vehicle-form" class="panel compact-form">
      <label for="vehicle-select">Vehicle</label>
      <select id="vehicle-select" name="vehicle-select"></select>
    </form>

    <p id="status-message" class="status-message" aria-live="polite"></p>

    <div class="panel-grid">
      <section class="panel">
        <h2>Add Material Cargo</h2>
        <form id="material-form" class="form-grid">
          <label for="material-type">Material Type</label>
          <select id="material-type" name="material-type" required></select>

          <label for="material-amount">Material Amount</label>
          <input id="material-amount" name="material-amount" type="number" min="1" required />

          <button type="submit">Add Material Cargo</button>
        </form>
      </section>

      <section class="panel">
        <h2>Add Standard Cargo</h2>
        <form id="standard-form" class="form-grid">
          <label for="standard-name">Cargo Name</label>
          <input id="standard-name" name="standard-name" type="text" placeholder="Leave empty for auto-name" />

          <div class="box-grid">
            <div>
              <label for="box-s">S Boxes</label>
              <input id="box-s" name="box-s" type="number" min="0" value="0" />
            </div>
            <div>
              <label for="box-m">M Boxes</label>
              <input id="box-m" name="box-m" type="number" min="0" value="0" />
            </div>
            <div>
              <label for="box-l">L Boxes</label>
              <input id="box-l" name="box-l" type="number" min="0" value="0" />
            </div>
            <div>
              <label for="box-xl">XL Boxes</label>
              <input id="box-xl" name="box-xl" type="number" min="0" value="0" />
            </div>
          </div>

          <button type="submit">Add Standard Cargo</button>
        </form>
      </section>
    </div>

    <section class="panel">
      <div class="panel-header">
        <h2>Current Order</h2>
        <button id="commit-order-button" type="button">Add Current Order To Storage</button>
      </div>
      <p id="order-summary" class="summary"></p>
      <table class="cargo-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Boxes [S,M,L,XL]</th>
            <th>SCU</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="order-table-body"></tbody>
      </table>
    </section>

    <section class="panel">
      <h2>Storage</h2>
      <p id="storage-summary" class="summary"></p>
      <table class="cargo-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Cargo Count</th>
            <th>Order SCU</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="storage-table-body"></tbody>
      </table>
    </section>
  </div>
`;var c=document.querySelector(`#vehicle-select`),l=document.querySelector(`#material-form`),u=document.querySelector(`#material-type`),d=document.querySelector(`#material-amount`),f=document.querySelector(`#standard-form`),p=document.querySelector(`#standard-name`),m=document.querySelector(`#status-message`),h=document.querySelector(`#order-table-body`),g=document.querySelector(`#storage-table-body`),_=document.querySelector(`#order-summary`),v=document.querySelector(`#storage-summary`),y=document.querySelector(`#commit-order-button`),b=1,x,S,C;function w(){c.innerHTML=Object.entries(r).map(([e,t])=>`<option value="${e}">${t[0]} (${t[1]} SCU)</option>`).join(``)}function T(){u.innerHTML=s.map(e=>`<option value="${e}">${e}</option>`).join(``)}function E(){return new a(`Current Order`,[])}function D(e,t=!1){m.textContent=e,m.classList.toggle(`error`,t)}function O(){return[Number(document.querySelector(`#box-s`).value),Number(document.querySelector(`#box-m`).value),Number(document.querySelector(`#box-l`).value),Number(document.querySelector(`#box-xl`).value),0,0,0].map(e=>!Number.isFinite(e)||e<0?0:Math.trunc(e))}function k(e){return`${e[0]}, ${e[1]}, ${e[2]}, ${e[3]}`}function A(n){let r=n.getBoxes(),i=e[n.getCargoContent()]||[],a=r.map((e,n)=>({count:e,dimension:t[n],amountPerBox:i[n]})).filter(e=>e.count>0);return a.length?a.map(e=>`${e.dimension}: ${e.count}x${e.amountPerBox}`).join(` | `):`-`}function j(e){return e.getIsMaterial()?A(e):k(e.getBoxes())}function M(e){if(!e.getIsMaterial())return e.getCargoContent();let t=e.getMaterialAmount();return`${e.getCargoContent()} (${t})`}function N(){let e=C.getCargoList();if(!e.length){h.innerHTML=`<tr><td colspan="6">No cargo in current order.</td></tr>`;return}h.innerHTML=e.map((e,t)=>{let n=e.getIsMaterial()?`Material`:`Standard`;return`
        <tr>
          <td>${t+1}</td>
          <td>${M(e)}</td>
          <td>${n}</td>
          <td>${j(e)}</td>
          <td>${e.getOccupiedSpace()}</td>
          <td><button type="button" class="row-remove-button" data-remove-order-cargo-index="${t}">Remove</button></td>
        </tr>
      `}).join(``)}function P(){let e=S.getOrders();if(!e.length){g.innerHTML=`<tr><td colspan="4">No orders committed to storage.</td></tr>`;return}g.innerHTML=e.map((e,t)=>{let n=e.getCargoList().map(e=>`<li>${M(e)} | ${e.getIsMaterial()?`Material`:`Standard`} | Boxes: [${j(e)}] | ${e.getOccupiedSpace()} SCU</li>`).join(``);return`
        <tr>
          <td>
            <details>
              <summary>${e.getOrderName()} #${e.getOrderId()}</summary>
              <ul class="order-details-list">${n}</ul>
            </details>
          </td>
          <td>${e.getCargoList().length}</td>
          <td>${e.getTotalSCU()}</td>
          <td><button type="button" class="row-remove-button" data-remove-storage-order-index="${t}">Remove</button></td>
        </tr>
      `}).join(``)}function F(){let e=r[x][0],t=S.getVehicleCapacity(),n=S.getUsedStorage(),i=S.getCurrentAvailableStorage();_.textContent=`Current order cargo: ${C.getCargoList().length} | Current order SCU: ${C.getTotalSCU()}`,v.textContent=`Vehicle: ${e} | Capacity: ${t} SCU | Used: ${n} SCU | Available: ${i} SCU | Committed orders: ${S.getOrders().length}`}function I(){N(),P(),F()}function L(e){x=e,S=new o(r[x]),a.resetOrderIds(),C=E(),b=1,D(`Vehicle changed. Storage and order have been reset.`),I()}l.addEventListener(`submit`,e=>{e.preventDefault();try{let e=new i({cargoContent:u.value,isMaterial:!0,amount:Number(d.value)});C.addCargo(e),D(`Material cargo added to current order.`),d.value=``,d.focus(),I()}catch(e){D(e.message,!0)}}),f.addEventListener(`submit`,e=>{e.preventDefault();let t=O();if(t.slice(0,4).reduce((e,t)=>e+t,0)<=0){D(`Add at least one box for standard cargo.`,!0);return}let n=new i({cargoContent:p.value.trim()||`cargo${b++}`,isMaterial:!1,boxes:t});C.addCargo(n),D(`Standard cargo added to current order.`),f.reset(),document.querySelector(`#box-s`).value=0,document.querySelector(`#box-m`).value=0,document.querySelector(`#box-l`).value=0,document.querySelector(`#box-xl`).value=0,I()}),h.addEventListener(`click`,e=>{let t=e.target;if(!(t instanceof HTMLElement))return;let n=t.getAttribute(`data-remove-order-cargo-index`);if(n===null)return;let r=Number(n);if(!C.removeCargoAt(r)){D(`Could not remove order entry.`,!0);return}D(`Entry removed from current order.`),I()}),g.addEventListener(`click`,e=>{let t=e.target;if(!(t instanceof HTMLElement))return;let n=t.getAttribute(`data-remove-storage-order-index`);if(n===null)return;let r=Number(n);if(!S.removeOrderAt(r)){D(`Could not remove storage entry.`,!0);return}D(`Entry removed from storage.`),I()}),y.addEventListener(`click`,()=>{if(C.isEmpty()){D(`Current order is empty. Add cargo first.`,!0);return}if(!S.addOrder(C)){D(`Not enough storage for this order.`,!0);return}D(`Order committed to storage.`),C=E(),I()}),c.addEventListener(`change`,()=>{L(c.value)}),w(),T(),L(c.value);