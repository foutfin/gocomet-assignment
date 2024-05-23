enum SearchError{
    failed,
    nothingfound,
    noerror
}

enum cardStatus{
    pending,
    crawling,
    success,
    failed
}
enum BlogError{
    notfound,
    failed,
    nothing
}

export  {SearchError,cardStatus,BlogError}