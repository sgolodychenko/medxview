package spring.pg;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

/**
 * Created by Serhiy_Golodychenko on 8/15/2016.
 */
@RestController
public class DemoController {

    @RequestMapping(path = "/test")
    public String test() {
        return new Date().toString();
    }
}
