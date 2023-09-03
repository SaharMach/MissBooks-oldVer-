const {useState, useEffect} = React

import { BookList } from "../cmps/BookList.jsx";
import { storageService } from "../services/async-storage.service.js";
import { bookService } from "../services/book.service.js";
import { BookDetails } from "./BookDetails.jsx";
import { BookFilter } from "../cmps/BookFilter.jsx";


export function BookIndex(){
    const [books, setBooks] = useState(null)
    const [selectedBookId, setSelectedBookId] = useState(null)
    const [filterBy,setFilterBy] = useState(bookService.getDefaultFilter())

    useEffect(()=> {
        bookService.query(filterBy)
            .then(books => setBooks(books))
    },[filterBy])

    function onRemoveBook(bookId){
        bookService.remove(bookId)
            .then(() => {setBooks(prevBook => 
                prevBook.filter(book => book.id !== bookId))})
    }

    function onSelectedBookId(bookId){
        setSelectedBookId(bookId)
    }

    function onSetFilterBy(filterBy){  
        console.log(filterBy);
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

 

    if(!books) return <div>Loading...</div>
    return (
        <section className="books-container">
            {!selectedBookId && 
                <React.Fragment>
                    <BookFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy}/>
                    <BookList books={books} onRemoveBook={onRemoveBook} onSelectedBookId={onSelectedBookId}/>
                </React.Fragment>
            }
            
            {selectedBookId && <BookDetails onBack={() => onSelectedBookId(null)} bookId={selectedBookId} />}
        </section>
    )
}