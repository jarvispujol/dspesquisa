package com.devsuperior.dspesquisa.controllers;

import com.devsuperior.dspesquisa.dto.RecordDTO;
import com.devsuperior.dspesquisa.dto.RecordInsertDTO;
import com.devsuperior.dspesquisa.services.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping(value = "/records")
public class RecordController {

    @Autowired
    private RecordService recordService;

    @PostMapping
    public ResponseEntity<RecordDTO> save(@RequestBody RecordInsertDTO dto){
        RecordDTO newDTO = recordService.saveRecord(dto);
        return ResponseEntity.ok().body(newDTO);
    }

    @GetMapping
    public ResponseEntity<Page<RecordDTO>> findAll(
            @RequestParam(value = "min", defaultValue = "") String minDt,
            @RequestParam(value = "max", defaultValue = "") String maxDt,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "linesPerPage", defaultValue = "12") Integer linesPerPage,
            @RequestParam(value = "orderBy", defaultValue = "moment") String orderBy,
            @RequestParam(value = "direction", defaultValue = "DESC") String direction) {

        Instant minDate = ("".equals(minDt)) ? null : Instant.parse(minDt);
        Instant maxDate = ("".equals(maxDt)) ? null : Instant.parse(maxDt);

        if ( linesPerPage == 0) {
            linesPerPage = Integer.MAX_VALUE;
        }

        PageRequest pageRequest = PageRequest.of(page, linesPerPage, Sort.Direction.valueOf(direction), orderBy);

        Page<RecordDTO> list = recordService.findByMoments(minDate, maxDate, pageRequest);
        return ResponseEntity.ok().body(list);
    }
}
