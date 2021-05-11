export default function setPrinterMargin (win: any, printerMargin: any) {
	win.print({marginsType:printerMargin});
}
