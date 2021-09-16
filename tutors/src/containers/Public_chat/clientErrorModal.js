const ClientErrorModal=()=>{

    return(

        <div>
{/* // <!-- Client Error MODAL --> */}
<button type="button" id="id_trigger_client_error_modal" className="d-none btn btn-primary" data-toggle="modal" data-target="#id_client_error_modal">
</button>
<div className="modal fade" id="id_client_error_modal" tabIndex="-1" role="dialog">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Socket Client Error</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <p id="id_client_error_modal_body">Something went wrong.</p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal" id="id_client_error_modal_close_btn">Close</button>
      </div>
    </div>
  </div>
</div>
{/* // <!-- Client Error MODAL --> */}
</div>
    )}

    export default ClientErrorModal