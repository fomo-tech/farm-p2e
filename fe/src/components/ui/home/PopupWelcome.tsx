import { Modal } from 'antd'
import popup_img from 'assets/images/popup.png'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const PopupWelcome = () => {
    const [showModal, setShowModal] = useState(true)
    return (
        <Modal centered open={showModal}
            onCancel={() => setShowModal(false)}
            width={350} footer={null} className='pop-up-welcome'>
            <div className='rounded-xl overflow-hidden relative'>
                <Link to='/treasure'>
                    <img src={popup_img} alt='' className='object-cover' />
                </Link>
            </div>
        </Modal>
    )
}

export default PopupWelcome