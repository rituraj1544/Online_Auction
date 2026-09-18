package com.example.auction.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class BidSocketController {
    @MessageMapping("/bid")
    public void ignoreClientBidEvents(String message) {
        // Bid broadcasts are sent only after REST validation in BidServiceImpl.
    }
}
