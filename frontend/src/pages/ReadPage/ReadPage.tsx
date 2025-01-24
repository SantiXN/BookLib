import { useEffect, useState } from 'react';
import PdfViewer from '../../component/PdfViewer/PdfViewer';
import LoadingMessage from '../../component/common/LoadingMessage/LoadingMessage';
import { useParams } from 'react-router-dom';
import useApi from '../../../api/ApiClient';

const ReadPage = () => {
    const { BookApi } = useApi();

    const [fileUrl, setFileUrl] = useState('test');
    
    const { id } = useParams<{ id: string }>();
    const curBookId = id ? Number(id) : 0;

    useEffect(() => {
        BookApi.getBookInfo({ bookID: curBookId })
            .then((response) => {
                if (response.book) {
                    console.log(response.book)
                    setFileUrl(`/${response.book.filePath}`);
                }
            })
            .catch(() => alert('При загрузке книги произошла ошибка'));
    }, [curBookId])

    if (fileUrl == '') return <LoadingMessage />

    return (
        <div style={{width: '100%', height: '78vh'}}>
            <PdfViewer fileUrl={fileUrl}/>
        </div>
    )
}

export default ReadPage;