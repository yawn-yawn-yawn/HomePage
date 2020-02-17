import React from 'react'
import { findItemByID } from '../../../util/findItem'
import ErrorList from '../../common/ErrorList'
import { checkIsEmpty, parseStringToBool } from '../../../util/validation'

class AdminEdit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.itemID,
            errors: [],
            isInitialized: false,
            isCreate: false,

            values: props.values,
        }
        this.fileInput = props.fileInput

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        // createの場合
        if(typeof this.state.id === 'undefined') {
            this.setState({
                isInitialized: true,
                isCreate: true,
            })
            return
        }
        // updateの場合初期値が必要なので取得
        this.props.fetchRequest()
    }

    componentDidUpdate() {
        if(this.state.isInitialized) {
            return
        }
        // updateの場合のformの初期化
        if(Object.keys(this.props.items).length) {
            const item = findItemByID(this.props.items, this.state.id)
            const values = this.state.values
            Object.keys(item).map(field => {
                if(field === 'tag' || field === 'user') {
                // if(typeof item[field] === 'object') {
                    // TODO: tagでfetchされる。tag_idに値を入れなくちゃいけない時
                    //       めっちゃハードだからどうしようこれ
                    values[field+"_id"] = item[field].id
                    return
                }
                if(typeof values[field] === 'undefined') {
                    return
                }
                values[field] = item[field]
            })
            this.setState({
                values: values,
                isInitialized: true,
            })
        }
    }

    handleChange(e) {
        const field = e.target.name
        this.setState({
            values: Object.assign(this.state.values, { [field]: e.target.value })
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        // 空値チェック
        // 親でfield定義の時に、required: trueをやってるとチェックしてくれる
        const errors = []
        this.props.fields.filter(field => field.required)
            .map(field => {
                var value
                if(field.type === "file") {
                    value = this.props.fileInput.current.files[0]
                } else {
                    value = this.state.values[field.name]
                }
                if(checkIsEmpty(value)) {
                    errors.push({ id: field.name+"Empty", content: field.label+"は必須です" })
                }
            })
        if (errors.length > 0) {
            this.setState({ errors })
            return
        }

        const body = generateBody(this.props.fields, this.state.values)
        // 変換が必要なフィールドを引っ掛ける
        // TODO: ここgenerateBodyでやればよくね？と思ってしまった
        this.props.fields.filter(field => field.requestType === "int" || field.requestType === "bool")
            .map(field => { 
                switch(field.requestType) {
                    case "int":
                        body[field.name] = parseInt(body[field.name]) 
                        return
                    case "bool":
                        body[field.name] = parseStringToBool(body[field.name])
                        return
                }
            })

        // typeがfileのフィールドの探索 
        if (!this.props.fields.filter(field => field.type === "file").length) {
            // file がない場合はそのままリクエスト
            if (this.state.isCreate) {
                this.props.createRequest(body)
            } else {
                this.props.updateRequest(this.state.id, body)
            }
            return
        }

        // fileのフィールドがあった場合. form dataの作成
        const formData = new FormData()
        formData.append("body", JSON.stringify(body))
        formData.append("file", this.props.fileInput.current.files[0])

        // dispatch
        if(this.state.isCreate) {
            this.props.createRequest(formData)
        } else {
            this.props.updateRequest(this.state.id, formData)
        }
    }

    render() {
        // 初期化がまだならなんも表示しない。
        // todo: 何かしたければここにー
        if(!this.state.isInitialized) {
            return (
                <></>
            )
        }

        return (
            <form className="form-admin" onSubmit={this.handleSubmit}>
                {
                    this.state.errors.length
                        ? <ErrorList errors={this.state.errors} />
                        : <></>
                }
                <table className="mb-20">
                    <tbody>
                        {
                            this.props.fields.map(field => (
                                <InputField
                                    key={field.name}
                                    field={field}
                                    value={this.state.values[field.name]}
                                    fileInput={this.props.fileInput}
                                    handleChange={this.handleChange}/>
                            ))
                        }
                    </tbody>
                </table>
                <div className="al-center">
                    <button type="submit" className="btn btn-primary">保存</button>
                </div>
            </form>
        )
    }
}


// inputフォームを作成するよ
const InputField = (props) => {
    var inputField
    if(props.field.type === "text" || props.field.type === "date" || props.field.type === "password" || props.field.type === "number") {
        inputField = (
            <input
                type={props.field.type}
                className={`input-admin-${props.field.type}`}
                name={props.field.name}
                value={props.value}
                onChange={props.handleChange} />)
    }
    if (props.field.type === "textarea") {
        inputField = (
            <textarea
                type={props.field.type}
                className={`input-admin-${props.field.type}`}
                name={props.field.name}
                value={props.value}
                onChange={props.handleChange}></textarea>)
    }
    if(props.field.type === "checkbox") {
        inputField = (
            <input
                type={props.field.type}
                className={`input-admin-${props.field.type}`}
                name={props.field.name}
                value={props.value}
                onChange={props.handleChange} />)
    }
    if (props.field.type === "select") {
        inputField = (
            <select
                className={`input-admin-${props.field.type}`}
                name={props.field.name}
                value={props.value}
                onChange={props.handleChange}>
                <option hidden>選択してください</option>
                {
                    props.field.options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))
                }
            </select>
        )
    }
    if (props.field.type === "file") {
        inputField = (
            <input type="file" ref={props.fileInput} />
        )
    }

    return (
        <tr className="form-admin-item">
            <td><label className="input-admin-label">{props.field.label}</label></td>
            <td>
                {inputField}
            </td>
        </tr>
    )
}


// generateBody fields = [{label, name, type}], values=[{props}]
const generateBody = (fields, values) => {
    const body = {}
    fields.map(field => {
        switch(field.type) {
            case "file":
                break
            // 事前に処理が必要なものはcaseで引っ掛けて。
            // fallするから、最後は必ずdafult通る
            case "date":
                values[field.name] = values[field.name].replace(/-/g, "/")
            default:
                Object.assign(body, {
                    [field.name]: values[field.name]
                })
        }
    })
    return body
}

export default AdminEdit
