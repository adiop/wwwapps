<% request.setAttribute("title", "Patent Marking"); %>

<jsp:include page="/template/header.jsp" />

<script src="patents.js"></script>

<style>

    #searchResults {
        padding: 30px;
    }

    #searchResults p {
        margin: 10px;
    }

</style>

<div class="page">
    <div class="page-title">
        <h1>Virtual Patent Marking</h1>
    </div>
    <div class="page-body">

        <div style="padding: 30px;">
            The following WARN<img src="r-sym.gif"> products are protected by patents in the United States and elsewhere. This website is provided to satisfy
            the virtual patent marking provisions of the America Invents Act, 35 U.S.C <img src="section-sym.gif">287(a). The following list of WARN products
            may  not be all inclusive, and other WARN<img src="r-sym.gif"> products not listed here may be protected by one or more patents. Information
            included in this listing does not prevent Warn Industries from pursuing any and all legal rights we may have for the
            purpose of protecting our intellectual property rights.
        </div>

        <form>

            <div class="fieldset">
                <div class="title">
                    <strong>Search by Patent Numer or Item Number</strong>
                </div>
                <div class="form-fields">
                    <div class="inputs first-name">
                        <label for="patent_number">Patent Number:</label>
                        <input name="patent_number" id="patent_number" type="text" value="" size="30" class="text-box single-line" data-val="true">
                    </div>
                    <div class="inputs first-name">
                        <label for="item_number">Item Number:</label>
                        <input name="item_number" id="item_number" type="text" value="" size="30" class="text-box single-line" data-val="true">
                    </div>
                    <div class="buttons">
                        <input class="button-1" type="button" value="Search" onclick="searchClicked();">
                    </div>
                </div>
            </div>

            <div id="searchResults"></div>

        </form>

    </div>
</div>

<jsp:include page="/template/footer.jsp" />
