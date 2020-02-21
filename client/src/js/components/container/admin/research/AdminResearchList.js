import React from 'react'
import { connect } from 'react-redux'
import AdminList from '../AdminList'
import BreadCrumb from '../../../common/Breadcrumb'
import { fetchResearchesRequest, deleteResearchRequest } from '../../../../actions/action'
import { APIErrorList } from '../../../common/APIError'

const mapStateToProps = (state) => {
    return {
        researches: state.researches,
        apiError: state.apiError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchRequest: () => dispatch(fetchResearchesRequest()),
        deleteRequest: (id) => dispatch(deleteResearchRequest({ id }))
    }
}

class ConnectedResearchList extends React.Component {
    render() {
        return (
            <div className="content">
                <BreadCrumb items={[{ path: "/", label: "管理者サイト" }, { path: "/researches", label: "卒業研究" }]} />
                <APIErrorList
                    apiError={this.props.apiError}/>
                <AdminList
                    items={this.props.researches}
                    caption={"卒業研究"}
                    path={"researches"}
                    fetchRequest={this.props.fetchRequest}
                    deleteRequest={this.props.deleteRequest} />
            </div>
        )
    }
}

const AdminResearchList = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConnectedResearchList)

export default AdminResearchList