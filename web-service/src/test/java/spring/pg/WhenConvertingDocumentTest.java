package spring.pg;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.io.FileInputStream;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.fileUpload;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by Serhiy_Golodychenko on 8/15/2016.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(ConverterController.class)
public class WhenConvertingDocumentTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void ShouldConvertXdocToPdf() throws Exception{
        ConvertXdocToPdf("D:\\Projects\\Delk\\medxview.docs\\DocxBig.docx");
        ConvertXdocToPdf("D:\\Projects\\Delk\\sources\\medxview\\sample\\AL3818-US-002-ComboTherapy_CP_v-2.docx");
        ConvertXdocToPdf("D:\\Projects\\Delk\\sources\\medxview\\sample\\cover-letter.docx");
        ConvertXdocToPdf("D:\\Projects\\Delk\\sources\\medxview\\sample\\example table border line.docx");
        ConvertXdocToPdf("D:\\Projects\\Delk\\sources\\medxview\\sample\\example TOC is not convert.docx");
    }

    private void ConvertXdocToPdf(String path) throws Exception {
        File f = new File(path);
        FileInputStream fi = new FileInputStream(f);
        MockMultipartFile secmp = new MockMultipartFile("file", f.getName(),"multipart/form-data",fi);
        mockMvc.perform(fileUpload("/convert/xdoc")
                .file(secmp)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
        ;
    }

    @Test
    public void ShouldConvertDocToPdf() throws Exception{
        File f = new File("D:\\Projects\\Delk\\medxview.docs\\DocxBig.doc");
        FileInputStream fi = new FileInputStream(f);
        MockMultipartFile secmp = new MockMultipartFile("file", f.getName(),"multipart/form-data",fi);
        mockMvc.perform(fileUpload("/convert/doc")
                .file(secmp)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
        ;
    }

    @Test
    public void contextLoads() {
    }

}