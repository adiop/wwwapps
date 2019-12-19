<% request.setAttribute("title", "Web dealers"); %>

<jsp:include page="/template/header.jsp" />

<style>

    #dealersCell {
        display: flex;
        flex-wrap: wrap;
    }

    #dealersCell div {
        cursor: pointer;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 10px;
        padding: 5px;
        background-color: #fff;

    }

    #dealersCell div:hover {
        border-radius: 5%;
        background-color: #e2e2e2;
    }

    #dealersCell div img {
        border-radius: 5%;
    }

</style>

<div class="page">
    <div class="page-title">
        <h1>Web Dealers</h1>
    </div>
    <div class="page-body">

        <form>
            <div class="fieldset">
                <div class="form-fields">
                    <div class="inputs">
                        <label>WARN Authorized Online Dealers:</label>
                        <select name="productSelector" id="productSelector"	onchange="this.form.submit();">
                            <option value="hubs">Hubs
                            <option value="lights">Lights
                            <option value="plows">Plows
                            <option value="winches_atv">ATV Winches
                            <option value="winches_truck">Truck Winches
                        </select>
                    </div>
                </div>
            </div>
        </form>

        <div class="fieldset" id="dealersCell">

        </div>

        <div id="nonUSorCanadaDiv" style="display:none;">
            <h3>
                Currently there are no authorized Online Dealers that sell into your region.<br>
                <br>
                Please contact your local WARN Dealer by clicking <a href="/wwwapps/dealerlocator/dealerLocator.htm">Here</a>
            </h3>
        </div>

    </div>
</div>

<script src="webDealers.js"></script>

<jsp:include page="/template/footer.jsp" />
