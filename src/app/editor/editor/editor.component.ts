import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { FontTransformation } from 'src/ThirdParty/transHindiFont';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  Editor: any = ClassicEditor;
  fontConvClass = new FontTransformation();
  @Input() showPreview: boolean = false;

  public dataForm = new UntypedFormGroup({
    description: new UntypedFormControl(''),
    lang: new UntypedFormControl('en')
  });
  @Input() public set defaultLang(id: any) {
    if (id) {
      const lan = ['en', 'ta', 'hi']
      this.dataForm.patchValue({ lang: lan[+id - 1] });
    }
  }
  Lang = [{ id: 'en', name: 'English' }, { id: 'ta', name: 'Tamil' }, { id: 'hi', name: 'Hindi' }];
  showLangDd: boolean = false;
  formDataPreview: string = '';
  lastText: string = '';
  public editorConfig = {
    //plugins: [ Font],
    fontFamily: {
      options: [
        'default',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
        'Roboto, sans-serif'
      ],
      supportAllValues: true
    },
    language: 'ta',
    toolbar: [
      'heading', 'bulletedList', 'numberedList', 'fontFamily', '|', 'insertTable', '|', 'undo', 'redo', '|', 'ImageUpload'
    ],
    startupFocus: 'end'
  };

  @Input() public set content(text: any) {
    if (text) {
      this.dataForm.patchValue({ description: text })
    }
  }
  @ViewChild('editor_box', { static: false }) editor_box: CKEditorComponent = {} as CKEditorComponent;
  @ViewChild('langDiv') langDiv: ElementRef = {} as ElementRef;
  @Output() onChangeData: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {}

  onReady(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    editor.plugins.get('FileRepository').createUploadAdapter = (load: File) => {
      return new UploadAdapter(load);
    };
    editor.editing.view.document.on('clipboardInput', (evt: any, data: any) => {
      const dataTransfer = data.dataTransfer;
      const rtfContent = dataTransfer.getData('text/plain');
      if (!rtfContent) {
        return;
      }
      const viewContent = this.convertText(rtfContent);
      return data.content = editor.data.htmlProcessor.toView(viewContent);
      //const editingView = editor.editing.view;
      //editingView.scrollToTheSelection();
    });
    editor.editing.view.document.on('keydown', (e, data) => {
      console.log('on key', e, data)
      const keyCode = [18, 16, 17, 13, 8, 9, 20, 93, 38, 37, 40, 39, 46, 45, 36, 35, 33, 34, 39, 38, 37];
      if (keyCode.includes(data.keyCode)) {
        return;
      }else{
        console.log('event ',e)
         data.domEvent.stopPropagation();
         data.domEvent.preventDefault();
        e.stop()
      }
      // if (data.ctrlKey && (e.key == 'a' || e.key == 'v' || e.key == 'x' || e.key == 'c')) {
      if (data.ctrlKey && [86, 65, 88, 67].includes(data.keyCode)) {
        //skip cut and paste action
        return;
      }
      if (!isEmptyObj(data)) {
        this.onKeyup(data.domEvent,data?.domTarget.ckeditorInstance)
      }
    });
  }

  getCurrentCursorPosition(parentElement: any) {
    let selection: any = window.getSelection(),
      charCount = -1,
      node;

    if (selection.focusNode) {
      // if (Cursor._isChildOf(selection.focusNode, parentElement)) {
      node = selection.focusNode;
      charCount = selection.focusOffset;

      while (node) {
        if (node === parentElement) {
          break;
        }

        if (node.previousSibling) {
          node = node.previousSibling;
          charCount += node.textContent.length;
        } else {
          node = node.parentNode;
          if (node === null) {
            break;
          }
        }
      }
      //  }
    }

    return charCount;
  }

  onKeyup(e: any,instance) {
    console.log('on key up', e)
    if (e.key == ' ' || this.dataForm.value.lang == 'en') {
      this.insertAtCursor(e.key,'',instance);
      return;
    }
    this.elementClick(e.key,instance)
    return e;
  }

  elementClick(arg: any,instance) {
    //const appendData = arg;
    const selection = this.editor_box.editorInstance?.model.document.selection;
    const range = selection?.getFirstRange();
    //@ts-ignore
    const ref: any = this.editor_box.elementRef.nativeElement.lastElementChild.lastElementChild.querySelector('.ck-editor__editable_inline');
    const pos: any = range?.start.path[1];
    const innerText = ref.innerText;
    console.log('inner text', innerText)
    const prev = innerText[pos - 1] || '';
    const splitAt = (pos: any) => (x: any) => [x.slice(0, pos), x.slice(pos)]
    const splittedText = splitAt(pos)(innerText);
    const orginalText = splittedText[0].split(/\s+/).pop();
    console.log('original text ', orginalText)

    let prevData = orginalText ? this.revertText(orginalText) : '';
    const pData = prevData + arg;
    console.log(prevData, 'process data to ', pData);

    let appendData = this.convertText(pData);
    console.log(prev, 'prev data start');
    console.log(appendData, 'apend  start');
    // if (prev !== appendData[0]) {
    //   appendData = prev + appendData[1];
    // }
    this.insertAtCursor(appendData, prevData,instance)
  }


  insertAtCursor(textToInsert: any, prevData: any = '',instance:any={}) {
    prevData = prevData.trim();
    console.log('append data ****** ', textToInsert)
    instance?.model.change((writer: any) => {
      console.log('write start', textToInsert, writer);
      const selection = writer.model.document.selection;
      const range = selection.getFirstRange();
      if (prevData) {
        //@ts-ignore
        //const ref: any = this.editor_box.elementRef.nativeElement.lastElementChild.lastElementChild.firstChild;
        //const innerText = ref.innerText;
        const arrData = prevData.split('');
        const originalPos = range.start.path[1];
        range.end.path[1] = originalPos;
        range.start.path[1] = originalPos - (arrData.length);
        writer.remove(range);
        // return;
        // arrData.forEach((s: any) => {
        //   console.log(index, 'index')
        //   range.start.path[1] = originalPos - index;
        //   console.log(range.start.path[1], 'range path')
        //   const prev = innerText[range.start.path[1]] || '';
        //   console.log('before remove', prev);
        //   try {
        //     writer.remove(range);
        //   } catch {
        //     writer.remove(range);

        //     console.log('eeror', prev)
        //   }
        //   console.log('after remove', innerText[range.start.path[1]] || '');
        //   index++;
        // });

        //   for (const item of range.getItems()) {
        //     console.log(item.data, ' selectd text ') //return the selected text
        // } 
        //this.editor_box.editorInstance?.model.document.selection.getSelectedText().setData('');
        // if (prevData[1]) {
        //   range.start.path[1] = range.start.path[1] - 2;
        //   writer.remove(range);
        // }
        // range.start.path[1] = range.start.path[1];
        //range.end.path[0] = range.end.path[0] -1;
        // writer.remove(range);
        //textToInsert = textToInsert[1]
        console.log('write prev data', prevData);
      }
      // if(!prevData && range.start[0]== 0){
      //   writer.setSelection(this.editor_box.editorInstance?.model.document.getRoot(), 'end');
      // }
      console.log('range of data', range);
      console.log('write Obke', writer)
      writer.insert(textToInsert, range.start);
    });

    //move cursor to end
    //   editor.model.change( writer => {
    //     writer.setSelection( writer.createPositionAt( editor.model.document.getRoot(), 'end' ) );
    // } );

    // // get current text of the input
    // const value = input.innerText;
    // console.log('***********', value);
    // // save selection start and end position
    // const start = this.getCurrentCursorPosition(input);
    // const end = start + 1;

    // // update the value with our text inserted
    // const data = value.slice(0, start) + textToInsert + value.slice(end);
    // //this.editor_box.instance.insertText(data);
    // console.log(this.editor_box.editorInstance)
    // console.log('***********', input.innerText);
    //return input.innerText
    // update cursor to be at the end of insertion
    //input.selectionStart = input.selectionEnd = start + textToInsert.length;
  }


  revertText(text: string) {
    //const win: any = window;
    const lang: any = this.dataForm.value.lang;
    return this.fontConvClass.toConvert(text, lang, false)
  }

  convertText(text: string) {
    const lang: any = this.dataForm.value.lang || 'en';
    if (lang == 'en') {
      return text;
    }
    return this.fontConvClass.toConvert(text, lang, true)
  }

  async toggleLangDd(status = false) {
    this.showLangDd = status;
    if (status) {
      setTimeout(this.onfocus.bind(this), 1000)
      console.log(this.langDiv)
      //this.langDiv.nativeElement.focus();
    }
  }
  onfocus() {
    this.langDiv.nativeElement.focus();
  }

  onChangeDescription() {
    this.onChangeData.emit(this.description);
  }


  onSelectLang(id: string) {
    console.log(id)
    this.dataForm.patchValue({ lang: id });
    this.toggleLangDd();
  }

  public onSubmit(): void {
    console.log('Form submit, model', this.dataForm.value);
  }

  public reset(): void {
    this.dataForm!.reset();
  }

  public get description(): AbstractControl {
    //@ts-ignore
    return this.dataForm!.controls.description.value;
  }
  public get language(): any {
    const lng = this.dataForm!.controls.lang.value
    return this.Lang.filter((a: any) => a.id == lng)?.[0];
  }

}
export class UploadAdapter {
  private loader;
  constructor(loader: any) {
    this.loader = loader;
    console.log('read file', this.loader);
  }

  upload() {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          var myReader = new FileReader();
          myReader.onloadend = (e) => {
            resolve({ default: myReader.result });
          };
          myReader.readAsDataURL(file);
        })
    );
  }
}